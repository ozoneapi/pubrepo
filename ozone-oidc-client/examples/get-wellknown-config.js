const OidcClient = require('../src/oidc-client.js');
const clientConfig = require('./config/client-config.json');

async function go() {
  const oidcClient = new OidcClient(clientConfig);
  return oidcClient.getWellKnownConfiguration();
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
