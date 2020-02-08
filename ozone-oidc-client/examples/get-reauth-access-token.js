const OidcClient = require('../src/oidc-client.js');
const clientConfig = require('./config/client-config-local.json');

async function go() {
  const oidcClient = new OidcClient(clientConfig);
  const args = process.argv.slice(2);
  const intentID = args[0];
  return oidcClient.getTokenByJWTGrant('accounts openid', intentID);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
