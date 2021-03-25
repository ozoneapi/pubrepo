const OidcClient = require('../src/oidc-client.js');
const clientConfig = require('./config/client-config-cip-ui.json');

async function go() {
  const oidcClient = new OidcClient(clientConfig);
  return oidcClient.getTokenByAuthCodeGrant('accounts openid', "https://auth1.cip-sandbox.ozoneapi.co.uk/simple-redirect-url", process.argv[2]);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
