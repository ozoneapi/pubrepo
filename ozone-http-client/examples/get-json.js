const Http = require('../src/http.js');

async function go() {
  const params = {
  //  url: 'http://localhost:5700/.well-known/openid-configuration',
    url: 'https://s3-eu-west-1.amazonaws.com/keystore.o3bank.co.uk/ks3.jwks',
    parseJson: false,
    logLevel: 'debug'
  };

  return Http.do(params);
}

go()
  .then(out => console.log('done'))
  .catch(err => console.log(err));
