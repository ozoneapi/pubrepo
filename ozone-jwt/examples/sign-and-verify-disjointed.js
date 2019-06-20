const Jwt = require('../src/jwt.js');
const log = require('loglevel');

async function go() {
  log.getLogger('ozone-jwt').setLevel('debug');
  //
  // create a signature
  //
  const params = {
    header: {
      alg: 'PS256',
      kid: 'dISF5OP0NEnErg-TfWVc4eFjiZg'
    },
    body: {
      lorem: 'ipsum',
      sit: 'dolor',
      boo: true,
      in: 10
    },
    signingKeyFileName: 'c:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\o3-internal\\dISF5OP0NEnErg-TfWVc4eFjiZg.key'
  };
  const disjointedSignature = await Jwt.signDisjointed(params);

  //
  // and verify it back
  //
  const verifyParams = {
    alg: params.header.alg,
    signature: disjointedSignature,
    body: params.body,
    jwksUrl: 'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/7Ia4VfCtyXlaogT7gkDD8A.jwks'
  };
  const verified = await Jwt.verifyDisjointed(verifyParams);

  return verified;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
