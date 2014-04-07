# Common Patterns

<a id="sasl"></a>

## SASL

Starting from the version 2.2 libcouchbase supports CRAM-MD5
authentication mechanism. Which allows to avoid passing bucket
password as a plain text over the wires.

Along with this change, new setting was introduced
`LCB_CNTL_FORCE_SASL_MECH`. It forces a specific SASL mechanism to use
for authentication. This can allow a user to ensure a certain level of
security and have the connection fail if the desired mechanism is not available.

    lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_FORCE_SASL_MECH, "CRAM-MD5");
