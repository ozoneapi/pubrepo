const Crypto = require('../src/crypto.js');

async function go() {
  return Crypto.generateRSAKeyPair(2048, 'sig');
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
