const Jwt = require('../src/jwt.js');
const log = require('loglevel');

async function go() {
  log.getLogger('ozone-jwt').setLevel('debug');
  //
  // create a signature
  //
  const params = {
    // header: {
    //   "alg": "PS256",
    //   "b64": false,
    //   "crit": [
    //       "b64",
    //       "http://openbanking.org.uk/iat",
    //       "http://openbanking.org.uk/iss",
    //       "http://openbanking.org.uk/tan"
    //   ],
    //   "cty": "application/json",
    //   "http://openbanking.org.uk/iat": 1560853832,
    //   "http://openbanking.org.uk/iss": "C=, O=, OU=, CN=www.example.com",
    //   "http://openbanking.org.uk/tan": "openbanking.org.uk",
    //   "kid": "4PCjfQQYqQ4sGz0DJIlTyncgkyw",
    //   "typ": "JOSE"
    // },
    // //  {
    // //   alg: 'PS256',
    // //   kid: 'dISF5OP0NEnErg-TfWVc4eFjiZg',
    // //   cty: 'json'
    // // },
    // body: {"Data":{"ConsentId":"sdp-1-b5bbdb18-eeb1-4c11-919d-9a237c8f1c7d","Initiation":{"InstructionIdentification":"SIDP01","EndToEndIdentification":"FRESCO.21302.GFX.20","InstructedAmount":{"Amount":"15.00","Currency":"GBP"},"CreditorAccount":{"SchemeName":"SortCodeAccountNumber","Identification":"20000319470104","Name":"Messers Simplex & Co"}}},"Risk":{}},
    header: {
      "alg":"HS256",
      "b64":false,
      "crit":["b64"]
    },
    body: '$.02',
    secret: 'AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow'
    // signingKeyFileName:
    //   './certs/julian.key'
      //'c:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\o3-internal\\dISF5OP0NEnErg-TfWVc4eFjiZg.key'
  };
  const disjointedSignature = await Jwt.signDisjointed(params);

  //
  // and verify it back
  //
  const verifyParams = {
    alg: params.header.alg,
    signature: disjointedSignature,
    body: params.body,
    jwksUrl:
      'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/7Ia4VfCtyXlaogT7gkDD8A.jwks'
  };
  const verified = await Jwt.verifyDisjointed(verifyParams);

  return verified;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
