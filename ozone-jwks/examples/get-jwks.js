const Jwks = require('../src/jwks.js');

async function go() {
  // return Jwks.get('s3://keystore.o3bank.co.uk/jwks-trial.jwks', 'o3-mfa', );
  // return Jwks.getKeyByKid('s3://keystore.o3bank.co.uk/test-keys.jwks', '9Lwy9eumKKf8D7kHaimH9cwvcsVFgyInrIiWbyPqUbs', 'o3-mfa', );
  Jwks.init('s3://keystore.o3bank.co.uk/60213896a73051599d625e8c.jwks', 'o3-mfa');
  return Jwks.addKey('s3://keystore.o3bank.co.uk/60213896a73051599d625e8c.jwks', 2048, 'sig', undefined, 'o3-mfa',);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
