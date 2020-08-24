# End-to-end journey

This package provides a sample implementation of 
end-to-end journeys for the UK Open Banking R/W API
using a variety of security mechanisms.

The examples here assumes that the Ozone installation
accepts self-signed certificates and that the client hosts
their own JWKS.

## Create and register a client

### Generate two UUIDv4s to identify the organisation and software statement identifiers

There are a number of sites that can do this - eg https://uuidonline.com/
  
Lets say we have the following

- Organization Id: 9e15b042-e8e7-476b-9774-a62eda3375fe
- Software Id: 08c7e6a6-0008-4ac0-b094-dde01ccf694d

### Generate a transport certificate for the client and self-sign it

``` bash
# generate private key
openssl genrsa -out client-transport.key 2048

# generate CSR
openssl req -new -out client-transport.csr -key client-transport.key -subj "/C=GB/ST=/L=/O=Ozone Financial Technology Limited/OU=9e15b042-e8e7-476b-9774-a62eda3375fe/CN=08c7e6a6-0008-4ac0-b094-dde01ccf694d"

# sign it
openssl x509 -req \
  -in "client-transport.csr" \
  -CA "$OZONE_HOME/monorepo/crypto/issuers/ozone/ozone-ca.pem" \
  -CAkey "$OZONE_HOME/monorepo/crypto/issuers/ozone/ozone-ca.key" \
  -CAcreateserial \
  -out "client-transport.pem" \
  -days 500 \
  -sha256
```

### Generate keys for signing

The `ozone-crypto` package provides a utility to create a key pair and generate the JWKS for the public key and a PEM file for the private key

``` bash
cd $OZONE_HOME/pubrepo/ozone-crypto/examples
node generate-files.js <out-file-prefix>
```

### Upload the JWKS file
Upload the JWKS file so that it can be accessed through a HTTP URL.
Ensure that its `content-type` is set correctly to `application/jwk-set+json`

https://s3-eu-west-1.amazonaws.com/certs.o3bank.co.uk/jwks/9e15b042-e8e7-476b-9774-a62eda3375fe/08c7e6a6-0008-4ac0-b094-dde01ccf694d.jwks

## Accessing accounts resources

### Get a client credentials grant