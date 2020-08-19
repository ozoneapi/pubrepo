const Crypto = require('../src/crypto.js');

async function go() {
  const out = await Crypto.generateRSAKeyPair(2048, 'sig');

  console.log(`\nJWKS - public`);
  const pubJwks = { keys: [ out.publicKey] };
  console.log(JSON.stringify(pubJwks, undefined, 2));

  console.log(`\nJWKS - private`);
  const jwks = { keys: [ out.privateKey] };
  console.log(JSON.stringify(jwks, undefined, 2));

  console.log('\nPEM');
  console.log(out.pemFile);

  console.log('\nKey');
  console.log(out.privateKeyFile);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
