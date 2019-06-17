const Jwt = require('../src/jwt.js');

async function go() {
  const params = {
    'header': {
      'alg': 'RS256'
    },
    body: {
      lorem: 'ipsum',
      sit: 'dolor',
      boo: true,
      in: 10
    },
    signingKeyFileName: 'c:\\usr\\freddi\\projects\\ozone\\ca\\keys\\referenco-bank-tpp-aisp-signing.key'
  };
  return Jwt.sign(params);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
