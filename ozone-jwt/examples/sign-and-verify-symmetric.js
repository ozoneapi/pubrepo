const Jwt = require('../src/jwt.js');

async function go() {
  const params = {
    'header': {
      'alg': 'HS256'
    },
    body: {
      lorem: 'ipsum',
      sit: 'dolor',
      boo: true,
      in: 10
    },
    secret: 'elephantine'
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
