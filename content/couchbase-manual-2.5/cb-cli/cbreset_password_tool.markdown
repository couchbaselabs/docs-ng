
<a id="couchbase-admin-cbreset_password"></a>

# cbreset_password Tool

You use this tool to reset an administrative or read-only password. You can find this tool in the following locations, depending upon your platform:

<a id="table-couchbase-admin-cmdline-cbdocloader-locs"></a>

Operating System | Location
-------------|----------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin/tools/`                                                      
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

To reset the administrative password:

    ./cbreset_password hostname:port
    
This will result in output as follows:

    Please enter the new administrative password (or <Enter> for system generated password):
    
Enter a password of six characters or more or you can have the system generate one for you. After you enter a password or accept a generated one, the system will prompt you for confirmation:

    Running this command will reset administrative password.
    Do you really want to do it? (yes/no)yes

Upon success you will see this output:

    Resetting administrative password...
    Password for user Administrator was successfully replaced. New password is Uxye76FJ
    
There are a few possible errors from this command:

    {error,<<"The password must be at least six characters.">>}
    
    {error,<<"Failed to reset administrative password. Node is not initialized.">>}
    
The first one indicates you have not provided a password of adequate length. The second one indicates that Couchbase Server is not yet configured and running.

 