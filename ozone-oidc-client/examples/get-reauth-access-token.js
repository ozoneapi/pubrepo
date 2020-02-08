const OidcClient = require('../src/oidc-client.js');
const clientConfig = require('./config/client-config-local.json');

async function go() {
  const oidcClient = new OidcClient(clientConfig);
  return oidcClient.getTokenByJWTGrant('accounts openid',"aac-7b6b91e5-61ae-40a9-b42c-755108f4f3ff");
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
