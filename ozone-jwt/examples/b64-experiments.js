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
    signingKeyFileName: 'c:\\usr\\freddi\\projects\\ozone\\ca\\keys\\referenco-bank-tpp-aisp-signing.key'
  };
  const b64missing = await Jwt.sign(params);

  params.header.b64 = true;
  const b64true = await Jwt.sign(params);

  params.header.b64 = false;
  const b64false = await Jwt.sign(params);

  console.log('Part\t\tType\t\tValue');
  console.log(`Header\t\tMissing\t\t${b64missing.split('.')[0]}`)
  console.log(`Header\t\tTrue\t\t${b64true.split('.')[0]}`)
  console.log(`Header\t\tFalse\t\t${b64false.split('.')[0]}`)

  console.log(`Body\t\tMissing\t\t${b64missing.split('.')[1]}`)
  console.log(`Body\t\tTrue\t\t${b64true.split('.')[1]}`)
  console.log(`Body\t\tFalse\t\t${b64false.split('.')[1]}`)

  console.log(`Sign\t\tMissing\t\t${b64missing.split('.')[2]}`)
  console.log(`Sign\t\tTrue\t\t${b64true.split('.')[2]}`)
  console.log(`Sign\t\tFalse\t\t${b64false.split('.')[2]}`)
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
