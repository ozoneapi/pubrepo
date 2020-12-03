const OidcClient = require('ozone-oidc-client');
const clientConfig = require('./config/config-obie-directory.json');

async function go() {
  const oidcClient = new OidcClient(clientConfig);
  return oidcClient.getTokenByClientCredentialsGrant('AuthoritiesReadAccess ASPSPReadAccess TPPReadAll');
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
