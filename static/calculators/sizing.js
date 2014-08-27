//------------------------------------------------------
// Build Data Collection Object, hdd rates
//------------------------------------------------------
var sizing = {
    "cores": 1,
    "ram": 8,
    "XDCR": 0,
    "replica": 1,
    "perc": 1,
    "buckets": 1,
    "drive": 1,
    "keySize": 40,
    "valueSize": 5120,
    "totalDocs": 1000000,
    "readRate": 1000,
    "writeRate": 1000,
    "delRate": 1000,
    "compactionThreshold": .05,
    "backgroundFetchThreshold": .05,
    "backgroundFetchXDCR":.05,
    "metaData": 56,
    "osHeadroom": .20,
    "highMemWatermark": .85,
    "appendMultiplier": 3,
    "fragmentationMultiplier": 1,
    "locked": true,
    "views": false,
    "viewNum": 5,
    "viewMatch": 10,
    "viewSize": 10,
    "viewRows": 1,
    "threads": 75,
    "eviction": false
}

//------------------------------------------------------
// Calculations Function Called from any Event
//------------------------------------------------------

function reCalc() {

    sizing.drive = parseInt($("#selDrives").val());
    sizing.keySize = parseInt($("#keySize").val());
    sizing.valueSize = parseInt($("#valSize").val());
    sizing.totalDocs = parseInt($("#valDocs").val());
    sizing.readRate = parseInt($("#rateRead").val());
    sizing.writeRate = parseInt($("#rateWrite").val());
    sizing.delRate = parseInt($("#rateDelete").val());
    sizing.compactionThreshold = parseFloat($("#compactionThresholdConstant").val());
    sizing.backgroundFetchThreshold = parseFloat($("#backgroundThresholdConstant").val());
    sizing.backgroundFetchXDCR = parseFloat($("#backgroundThresholdXDCR").val());
    sizing.metaData = parseInt($("#metaDataConstant").val());
    sizing.osHeadroom = parseFloat($("#osHeadroomConstant").val());
    sizing.highMemWatermark = parseFloat($("#highMemConstant").val());
    sizing.appendMultiplier = parseInt($("#amendMultiplierConstant").val());
    sizing.fragmentationMultiplier = parseInt($("#fragmentMultiplierConstant").val());
    sizing.viewNum = parseInt($("#viewNum").val());
    sizing.viewSize = parseInt($("#viewSize").val());
    sizing.viewMatch = parseInt($("#viewMatch").val());
    sizing.viewRows = parseInt($("#viewRows").val());

    // -----------------
    // Disk Calcs
    //------------------

    // Calcs
    var maxWritePerc = .15 * (1 + (1 - sizing.perc));
    var rebalanceOverhead = (maxWritePerc * sizing.drive);
    var compactionOverhead = (sizing.compactionThreshold * sizing.drive);
    var cacheMisses = (sizing.backgroundFetchThreshold * sizing.drive);
    var xdcrRate = (sizing.drive * sizing.backgroundFetchXDCR) * sizing.XDCR;
    var updateRate = sizing.drive - rebalanceOverhead - compactionOverhead - cacheMisses - xdcrRate;
    var totalWriteRate = ((sizing.writeRate + sizing.delRate) * (1 + sizing.replica)) * (1 + sizing.buckets) ;
    var indexOnDiskSize = ((sizing.viewSize/100)*(sizing.viewMatch/100))*sizing.viewNum*sizing.viewRows;
    var diskBoundNodes = ((totalWriteRate / updateRate) + sizing.replica);
    if (diskBoundNodes < 3) {
        $("#lblDiskBound").html("3");
    } else {
        $("#lblDiskBound").html(Math.ceil(diskBoundNodes));
    }

    // -----------------
    // Mem Calcs
    //------------------

    // Calcs
    var usableMemory = sizing.ram * (1 - sizing.osHeadroom) * sizing.highMemWatermark;
    var totalDatasetSize = (sizing.totalDocs * sizing.valueSize * (1 + sizing.replica)) / 1073741824;
    var workingSetSize = totalDatasetSize * sizing.perc;
    var metaDatasetSize = (sizing.totalDocs * (sizing.keySize + sizing.metaData) * (1 + sizing.replica)) / 1073741824;
    var totalOnDisk = (totalDatasetSize + metaDatasetSize) * sizing.appendMultiplier * sizing.fragmentationMultiplier+
        indexOnDiskSize;
    var totalMemPerNode = workingSetSize + metaDatasetSize;
    var memBoundNodes = (totalMemPerNode / usableMemory) + sizing.replica;
    if (memBoundNodes < 3) {
        $("#lblMemBound").html("3");
    } else {
        $("#lblMemBound").html(Math.ceil(memBoundNodes));
    }

    $("#lblTotalDisk").html(Math.ceil(totalOnDisk) + " Gigs");
    $("#lblMemPerNode").html(Math.ceil(totalMemPerNode) + " Gigs");
}
//------------------------------------------------------
// Controls Constant Table Lock/Unlock
//------------------------------------------------------
function lock() {
    // Change CSS
    $("#tableConstants").removeClass("classTable");
    $("#tableConstants").addClass("classTableConstants");

    // Make Inputs editable
    $('#compactionThresholdConstant').prop('readonly', true);
    $('#backgroundThresholdConstant').prop('readonly', true);
    $('#backgroundThresholdXDCR').prop('readonly', true);
    $('#metaDataConstant').prop('readonly', true);
    $('#osHeadroomConstant').prop('readonly', true);
    $('#highMemConstant').prop('readonly', true);
    $('#amendMultiplierConstant').prop('readonly', true);
    $('#fragmentMultiplierConstant').prop('readonly', true);

}

function unLock() {
    // Change CSS
    $("#tableConstants").removeClass("classTableConstants");
    $("#tableConstants").addClass("classTable");

    // Make Inputs readonly
    $('#compactionThresholdConstant').prop('readonly', false);
    $('#backgroundThresholdConstant').prop('readonly', false);
    $('#backgroundThresholdXDCR').prop('readonly', false);
    $('#metaDataConstant').prop('readonly', false);
    $('#osHeadroomConstant').prop('readonly', false);
    $('#highMemConstant').prop('readonly', false);
    $('#amendMultiplierConstant').prop('readonly', false);
    $('#fragmentMultiplierConstant').prop('readonly', false);
}

//------------------------------------------------------
// Slider Constructors/Events
//------------------------------------------------------
$("#sliderCores").slider({
    value: 1,
    min: 1,
    max: 1024,
    step: 1,
    slide: function (event, ui) {
        $("#sliderCores-value").val(ui.value);
        sizing.cores = ui.value;
        reCalc();
    }
});
$("#sliderCores-value").val($('#sliderCores').slider('value'));

$("#sliderRam").slider({
    value: 8,
    min: 8,
    max: 1024,
    step: 1,
    slide: function (event, ui) {
        $("#sliderRam-value").val(ui.value);
        sizing.ram = ui.value;
        reCalc();
    }
});

$("#sliderRam-value").val($('#sliderRam').slider('value'));

$("#sliderXDCR").slider({
    value: 0,
    min: 0,
    max: 12,
    step: 1,
    slide: function (event, ui) {
        $("#sliderXDCR-value").html(ui.value);
        sizing.XDCR = ui.value;
        reCalc();
    }
});

$("#sliderXDCR-value").html($('#sliderXDCR').slider('value'));

$("#sliderReplica").slider({
    value: 1,
    min: 0,
    max: 3,
    step: 1,
    slide: function (event, ui) {
        $("#sliderReplica-value").html(ui.value);
        sizing.replica = ui.value;
        reCalc();
    }
});

$("#sliderReplica-value").html($('#sliderReplica').slider('value'));

$("#sliderPerc").slider({
    value: 100,
    min: 10,
    max: 100,
    step: 10,
    slide: function (event, ui) {
        $("#sliderPerc-value").html(ui.value);
        sizing.perc = (ui.value / 100);
        reCalc();
    }
});

$("#sliderPerc-value").html($('#sliderPerc').slider('value'));

$("#sliderBuckets").slider({
    value: 1,
    min: 1,
    max: 10,
    step: 1,
    slide: function (event, ui) {
        $("#sliderBuckets-value").html(ui.value);
        sizing.buckets = ui.value;
        reCalc();
    }
});

$("#sliderBuckets-value").html($('#sliderBuckets').slider('value'));

$("#sliderThread").slider({
    value: 75,
    min: 1,
    max: 100,
    step: 1,
    slide: function (event, ui) {
        $("#sliderThread-value").val(ui.value);
        sizing.threads = ui.value;
        reCalc();
    }
});
$("#sliderThread-value").val($('#sliderThread').slider('value'));

$("#sliderRam-value").change(function () {
    var value = this.value;
    console.log(value);
    $("#sliderRam").slider("value", parseInt(value));
    reCalc();
});

$("#sliderCores-value").change(function () {
    var value = this.value;
    console.log(value);
    $("#sliderCores").slider("value", parseInt(value));
    reCalc();
});

$("#sliderThread-value").change(function () {
    var value = this.value;
    console.log(value);
    $("#sliderThread").slider("value", parseInt(value));
    reCalc();
});

//------------------------------------------------------
// Load Event Handlers for Inputs and Dropdown
//------------------------------------------------------

$("#keySize").change(function () {
    reCalc();
});

$("#valSize").change(function () {
    reCalc();
});

$("#valDocs").change(function () {
    reCalc();
});

$("#rateRead").change(function () {
    reCalc();
});

$("#rateWrite").change(function () {
    reCalc();
});

$("#rateDelete").change(function () {
    reCalc();
});

$("#selDrives")
    .change(function () {
        reCalc();
    });
$("#viewNum")
    .change(function () {
        reCalc();
    });
$("#viewRows")
    .change(function () {
        reCalc();
    });
$("#viewMatch")
    .change(function () {
        reCalc();
    });
$("#viewSize")
    .change(function () {
        reCalc();
    });

$("#compactionThresholdConstant")
    .change(function () {
        reCalc();
    });
$("#backgroundThresholdConstant")
    .change(function () {
        reCalc();
    });
$("#backgroundThresholdXDCR")
    .change(function () {
        reCalc();
    });
$("#metaDataConstant")
    .change(function () {
        reCalc();
    });
$("#osHeadroomConstant")
    .change(function () {
        reCalc();
    });
$("#highMemConstant")
    .change(function () {
        reCalc();
    });
$("#amendMultiplierConstant")
    .change(function () {
        reCalc();
    });
$("#fragmentMultiplierConstant")
    .change(function () {
        reCalc();
    });

$("#lockForm")
    .change(function () {
        if (sizing.locked) {
            unLock();
            sizing.locked = false;
        } else {
            lock();
            sizing.locked = true;
        }

    });

$("#selView")
    .change(function () {
        if (parseInt($("#selView").val()) == 1) {
            $("#tableView").show();
        } else {
            $("#tableView").hide();
        }
    });
$("#tableView").hide();

$("#selVersion")
    .change(function () {
        if (parseInt($("#selVersion").val()) == 3) {
            $("#tdThreadHeader").show();
            $("#tdThreadSlider").show();
            $("#tdTunableHeader").show();
            $("#tdTunableSelect").show();
        } else {
            $("#tdThreadHeader").hide();
            $("#tdThreadSlider").hide();
            $("#tdTunableHeader").hide();
            $("#tdTunableSelect").hide();
        }
    });
$("#tdThreadHeader").hide();
$("#tdThreadSlider").hide();
$("#tdTunableHeader").hide();
$("#tdTunableSelect").hide();

reCalc();