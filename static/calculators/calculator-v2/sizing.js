
var values = new Object();
var inputs = new Object();

function getbasevalues() {
    inputform = document.forms[0];

    for (id in inputform.elements) {
        name = inputform.elements[id].name;
        inputs[name] = 1;
        if (name == 'versions' || name == 'storagetype') {
            values[name] = inputform.elements[id].value;
        } else {
            values[name] = parseInt(inputform.elements[id].value);
        }
    }
}

function calculate() {

    getbasevalues();

    // Calcs on base figures

    values['workingset'] = (values['workingset']/100);
    values['copies'] = values['replicas']+1;

	if (values['versions'] == '2.1') {
    	values['disk_write_rate_hhd'] = 3000;
		values['disk_write_rate_ssd'] = 9000;
		values['disk_write_rate_ebs'] = 1500;
	} else {
    	values['disk_write_rate_hhd'] = 1500;
		values['disk_write_rate_ssd'] = 6000;
		values['disk_write_rate_ebs'] = 1000;
	}
		

    // Set the default

    values['disk_write_rate'] = values['disk_write_rate_hhd'];

    // The rebalance buffer increases with DGM ratio
    values['disk_rebalance_buffer'] = 0.16 * (1 + (1 - parseFloat(values['workingset'])));
    values['disk_background_fetches'] = 0.05;
	values['compaction_overhead'] = 0.05;

    values['update_write_rate_hhd'] = calculate_disk_write_rate(values['disk_write_rate_hhd']);
    values['update_write_rate_ssd'] = calculate_disk_write_rate(values['disk_write_rate_ssd']);
    values['update_write_rate_ebs'] = calculate_disk_write_rate(values['disk_write_rate_ebs']);

    // Calculate the values from user input

    if (values['storagetype'] == 'SSD') {
        values['disk_write_rate'] = values['disk_write_rate_ssd'];
    }
    if (values['storagetype'] == 'EBS') {
        values['disk_write_rate'] = values['disk_write_rate_ebs'];
    }

    values['update_write_rate'] = calculate_disk_write_rate(values['disk_write_rate']);

    // This is the required write rate for the entire cluster

    values['total_write_rate'] = (values['writeops'] + values['deleteops']) * values['copies'];

    // Constants/assumptions

    values['gbinbytes'] = 1024*1024*1024;
	
    // Metadata size from 1.8.x to 2.0 got changed from 56bytes to 64bytes per Key
    if (values['versions'] == '2.0') {
        values['metadatasize'] = 64;
    } else {
        values['metadatasize'] = 56;
    } 
	
    values['os_headroom'] = 0.20;
    values['high_watermark'] = 0.85;
    values['disk_headroom'] = 1.5;
    values['growth_rate_one'] = 1.5;
    values['growth_rate_two'] = 2;
    values['growth_rate_three'] = 3;
	values['appendonly_multiplier'] = 3;

    // RAM Calculations

    values['total_metadata']    = parseFloat((values['keycount'] *
                                              (values['metadatasize'] + values['keynamesize']) *
                                              values['copies'])/values['gbinbytes']).toFixed(2);

    values['total_dataset']     = parseFloat((values['keycount'] * values['valuesize'] *
                                              values['copies'])/values['gbinbytes']).toFixed(2);

    values['total_data_size']   = parseFloat(parseFloat(values['total_metadata']) +
                                             parseFloat(values['total_dataset'])).toFixed(2);
	
    // 3x multiplier for 2.0 (append-only + compaction overhead)
	if (values['versions'] == '2.0') {
        values['total_data_on_disk'] = parseFloat(parseFloat(values['total_data_size']) * values['appendonly_multiplier']).toFixed(2);
	} else {
		values['total_data_on_disk'] = parseFloat(parseFloat(values['total_data_size']) * values['disk_headroom']).toFixed(2);
	}

    values['total_workingset']  = parseFloat(values['total_dataset'] * values['workingset']).toFixed(2);

    values['total_data_in_ram'] = parseFloat(parseFloat(values['total_metadata']) +
                                             parseFloat(values['total_workingset'])).toFixed(2);

    values['avail_rampernode']  = parseFloat(values['rampernode'] * (1 - values['os_headroom']) * values['high_watermark']);

    values['useable_rampernode'] = parseFloat(values['rampernode'] * (1 - values['os_headroom'])).toFixed(0);

    values['nodes_by_ram']      = ((values['total_data_in_ram'] / values['avail_rampernode']) +
                                   values['replicas']).toFixed(0);

    minimumnodes('nodes_by_ram');

    values['nodes_growth_keys_base'] = calculate_nodes_keys_growth(1);
    values['nodes_growth_keys_one'] = calculate_nodes_keys_growth(values['growth_rate_one']);
    values['nodes_growth_keys_two'] = calculate_nodes_keys_growth(values['growth_rate_two']);
    values['nodes_growth_keys_three'] = calculate_nodes_keys_growth(values['growth_rate_three']);

    minimumnodes('nodes_growth_keys_base');
    minimumnodes('nodes_growth_keys_one');
    minimumnodes('nodes_growth_keys_two');
    minimumnodes('nodes_growth_keys_three');

    values['nodes_growth_values_base'] = calculate_nodes_values_growth(1);
    values['nodes_growth_values_one'] = calculate_nodes_values_growth(values['growth_rate_one']);
    values['nodes_growth_values_two'] = calculate_nodes_values_growth(values['growth_rate_two']);
    values['nodes_growth_values_three'] = calculate_nodes_values_growth(values['growth_rate_three']);

    minimumnodes('nodes_growth_values_base');
    minimumnodes('nodes_growth_values_one');
    minimumnodes('nodes_growth_values_two');
    minimumnodes('nodes_growth_values_three');

    // Disk Calculations

    values['nodes_by_disk']     = parseFloat((values['total_write_rate'] / values['update_write_rate']) +
                                             values['replicas']).toFixed(0);
    values['nodes_by_disk_hhd'] = parseFloat((values['total_write_rate'] / values['update_write_rate_hhd']) +
                                             values['replicas']).toFixed(0);
    values['nodes_by_disk_ssd'] = parseFloat((values['total_write_rate'] / values['update_write_rate_ssd']) +
                                             values['replicas']).toFixed(0);
    values['nodes_by_disk_ebs'] = parseFloat((values['total_write_rate'] / values['update_write_rate_ebs']) +
                                             values['replicas']).toFixed(0);

    minimumnodes('nodes_by_disk');
    minimumnodes('nodes_by_disk_hhd');
    minimumnodes('nodes_by_disk_ssd');
    minimumnodes('nodes_by_disk_ebs');

    // Disk Growth Rates

    values['nodes_growth_ops_base'] = values['nodes_by_disk'];

    values['nodes_growth_ops_one'] = parseFloat((values['total_write_rate'] * values['growth_rate_one']) /
                                                values['update_write_rate']).toFixed(0);

    values['nodes_growth_ops_two'] = parseFloat((values['total_write_rate'] * values['growth_rate_two']) /
                                                values['update_write_rate']).toFixed(0);

    values['nodes_growth_ops_three'] = parseFloat((values['total_write_rate'] * values['growth_rate_three']) /
                                                values['update_write_rate']).toFixed(0);

    minimumnodes('nodes_growth_ops_base');
    minimumnodes('nodes_growth_ops_one');
    minimumnodes('nodes_growth_ops_two');
    minimumnodes('nodes_growth_ops_three');

    // Results

    values['resultnodes'] = parseFloat(values['nodes_by_ram']).toFixed(0);
    values['resulttype']  = 'Memory';

    if (parseInt(values['nodes_by_disk']) >= parseInt(values['nodes_by_ram'])) {
        values['resultnodes'] = values['nodes_by_disk'];
        values['resulttype'] = 'I/O';
    }

    values['recommended_nodes'] = values['resultnodes'];

    minimumnodes('recommended_nodes');

    values['recommended_rampernode'] = values['useable_rampernode'];
    values['ram_pernode']       = (values['total_data_in_ram'] / values['recommended_nodes']).toFixed(2);

    // Required Disk Storage

    ram_base = parseInt(values['rampernode'] * 3).toFixed(0);


    values['nodes_storage_hhd'] = parseFloat(((values['total_data_on_disk']) /
                                              values['nodes_by_disk_hhd'])*2).toFixed(2);

    if (ram_base >= values['nodes_storage_hhd']) {
        values['nodes_storage_hhd'] = ram_base;
    }

    values['nodes_storage_ssd'] = parseFloat((values['total_data_on_disk'] /
                                              (values['nodes_by_disk_ssd']-values['replicas']))*2).toFixed(2);

    values['nodes_storage_ebs'] = parseFloat(((values['total_data_on_disk']) /
                                              values['nodes_by_disk_ebs'])*2).toFixed(2);

    if (ram_base >= values['nodes_storage_ebs']) {
        values['nodes_storage_ebs'] = ram_base;
    }

    if (values['storagetype'] == 'SSD') {
        values['nodes_storage'] = parseFloat((values['total_data_on_disk'] /
                                              (values['recommended_nodes']-values['replicas']))*2).toFixed(2);
    } else {
        disk_base = ((values['total_data_on_disk']) /
                     (values['recommended_nodes'] - values['replicas']) * 2);

        values['nodes_storage'] = disk_base;
        if (ram_base > disk_base) {
            values['nodes_storage'] = ram_base;
        }
    }
	
	// tombstone space used calculations 
	// keynamesize + 60 (bytes) * 2 ( stored twice) * (replica + 1) * deletionops * 60 * 60 * 24/(
	values['tombstone_space_required'] = (((values['keynamesize'] + 60) * 2 * (values['replicas'] + 1) * values['deleteops'] * 60 * 60 * 24 ) / ( (1024 * 1024 * 1024) * values['recommended_nodes'])).toFixed(2);
	
	// Tombstone space based on purge freq per node(GB)
	values['tombstone_space_required_purge'] = (values['purgefrequency'] * values['tombstone_space_required']).toFixed(2);

 
    for (id in values) {
        if (inputs[id] == 1) {
            continue;
        }
        foundfield = document.getElementById(id);
        if (foundfield != null) {
            foundfield.innerHTML = values[id];
        }
    }

    show('detail');
    show('results');
    show('storagecomparison');
    show('growth');
    window.location.hash = '#results';
}

function calculate_nodes_keys_growth(growth) {

    nodes = parseFloat((((values['keycount'] * growth * (values['metadatasize'] + values['keynamesize']) *
              values['copies'])/values['gbinbytes']) +
                        ((values['keycount'] * growth * values['valuesize'] *
                          values['copies'] * values['workingset'])/values['gbinbytes'])) /
                       values['avail_rampernode']).toFixed(0);

    return(nodes);
}

function calculate_nodes_values_growth(growth) {

    nodes = parseFloat((((values['keycount'] * (values['metadatasize'] + values['keynamesize']) *
              values['copies'])/values['gbinbytes']) +
                        ((values['keycount'] * growth * values['valuesize'] *
                          values['copies'] * values['workingset'])/values['gbinbytes'])) /
                       values['avail_rampernode']).toFixed(0);

    return(nodes);
}

function calculate_disk_write_rate(rate) {
    return (parseFloat(rate -
                       (rate * values['disk_rebalance_buffer']) -
                       (rate * values['disk_background_fetches']) -
				       (rate * values['compaction_overhead'])).toFixed(0));
}

function show(id) {

    document.getElementById(id).style.visibility='visible';
    document.getElementById(id).style.display='block';
}

function minimumnodes(id) {
    if (values[id] < 3) {
        values[id] = 3;
    }
}
