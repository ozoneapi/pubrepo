const Jwt = require('../src/jwt.js');

async function go() {
  const params = {
    'header': {
      'alg': 'PS256'
    },
    body: {
      lorem: 'ipsum',
      sit: 'dolor',
      boo: true,
      in: 10
    },
    signingKeyFileName: 'c:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\o3-internal\\dISF5OP0NEnErg-TfWVc4eFjiZg.key'
  };

  const signature = await Jwt.sign(params);
  console.log(signature);

  // verify it now
  const verifyParams = {
    alg: params.header.alg,
    secret: params.secret,
    signature
  };


  const verified = await Jwt.verify(verifyParams);
  console.log(`Verified: ${verified}`);

  return Jwt.decode(signature);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
