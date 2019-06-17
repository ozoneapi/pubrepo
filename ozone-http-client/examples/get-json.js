const Http = require('../src/http.js');

async function go() {
  const params = {
    url: 'https://authui.openbanking.api.tide.co/.well-known/openid-configuration',
    parseJson: true,
    logLevel: 'debug'
  };

  return Http.do(params);
}

go()
  .then(out => console.log('done'))
  .catch(err => console.log(err));
