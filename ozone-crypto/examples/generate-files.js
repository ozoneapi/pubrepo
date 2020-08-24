const fs = require('fs');
const Crypto = require('../src/crypto.js');

async function go() {
  const out = await Crypto.generateRSAKeyPair(2048, 'sig');

  // JWKS public
  const pubJwks = { keys: [out.publicKey] };
  const pubJwksOut = JSON.stringify(pubJwks, undefined, 2);
  fs.writeFileSync(`${process.argv[2]}.jwks`, pubJwksOut);

  // // private key pem file
  // fs.writeFileSync(`${process.argv[2]}.pem`, out.pemFile);

  // private key key file
  fs.writeFileSync(`${process.argv[2]}.key`, out.privateKeyFile);
}

go()
  .then(out => console.log('done'))
  .catch(err => console.log(err));
