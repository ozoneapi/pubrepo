const OidcClient = require('ozone-oidc-client');
const clientConfig = require('./config/config-obie-directory.json');
const OBDirClient = require('../src/ob-dir-client');

async function go() {
  const obDirClient = new OBDirClient(clientConfig);
  const oidcClient = new OidcClient(clientConfig.oidcClient);

  const token = await oidcClient.getTokenByClientCredentialsGrant('AuthoritiesReadAccess ASPSPReadAccess TPPReadAll');

  const scimResponse = await obDirClient.getScimResource('tpp', token, '0015800001ZEc3hAAD');
  
  return scimResponse;
}

go()
  .then((out) => console.log(out))
  .catch((err) => console.log(err));
