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
  return Jwt.sign(params);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
