# JWT Auth

## Introduction
A library that simplifies sending http requests to a server that relies on jwt based authentication.
This is not one of the OBIE standards, but is a standard pattern used by Ozone for integrating with its
customer's BES.

## Usage
For a complete usage example see the [examples](.\examples) folder.

- Step 1: Specify the http-client parameters.
These are exactly the same as documented in the `ozone-http-client` package.

Jwt Auth works over mutually authenticated TLS and the `certs` parameter must be provided.

```
const httpClientParams = {
  url: 'http://localhost:3050/hello',
  certs: {
    ca: 'c:\\usr\\freddi\\projects\\ozone\\ca\\certs\\ob-sandbox-issuing-chain.pem',
    cert: 'c:\\usr\\freddi\\projects\\ozone\\ca\\certs\\ozone-sandbox-transport.pem',
    'key': 'c:\\usr\\freddi\\projects\\ozone\\ca\\keys\\ozone-sandbox-transport.key'
  },
};
```

- Step 2: Specify the signing parameters
This specifies the method for signing the jwt header and the private key

```
const signingParams = {
  alg: 'RS256',
  iss: 'OpenBanking',
  sub: '0015800001041RHAAY',
  validity: 40,
  privateKey: {
    ...
    kid: 'W7DIWbfwsfxZIJl_PlaSS8vgQ3-cEtWtiNCAIXmJJMk',
  }
};
```
### parameters

#### alg
*Mandatory*
The signing algorithm. `PS256` or `RS256`.

#### iss
*Mandatory*

The `iss` of the jwt. Must match the `O` in the transport certificates subject.

#### sub
*Mandatory*
The `sub` claim to be used in the jwt. Must match the `OU` in the transport certificate's subject.

#### jti
*Optional*
The `jti` claim to be used in the jwt. If not specified, JwtAuth will generate a uuidv4 to use as a `jti`.

#### validity
*Mandatory*
The number of seconds that the jwt should be valid for.

#### privateKey
*Mandatory*
The private key used to sign the jwt. This is json object that follows the jwk format. See the `ozone-crypto` package to generate a key pair.

- Step 3: Call the http end-point

```
await HttpClient.doWithJwtAuth(httpClientParams, signingParams);
```
