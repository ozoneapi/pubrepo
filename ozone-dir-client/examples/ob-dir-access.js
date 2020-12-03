const OidcClient = require('ozone-oidc-client');
const clientConfig = require('./config/config-obie-directory.json');
const OBDirClient = require('../src/ob-dir-client');

async function go() {
  const obDirClient = new OBDirClient(clientConfig);
  const oidcClient = new OidcClient(clientConfig.oidcClient);

  const token = await oidcClient.getTokenByClientCredentialsGrant('AuthoritiesReadAccess ASPSPReadAccess TPPReadAll');

  //const resp = await obDirClient.getScimResource('tpp', token, '0015800001ZEc3hAAD');

  //const resp = await obDirClient.getResource('organisation', token, 'tpp'); // Get all TPPs
  //const resp = await obDirClient.getResource('organisation', token, 'tpp', '0015800001ZEc3hAAD'); //Get TPP info
  //const resp = await obDirClient.getResource('organisation', token, 'aspsp'); // Get all aspsps
  const resp = await obDirClient.getResource('organisation', token, 'aspsp', '0015800001ZEc3hAAD'); // Get aspsp info
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RHAAY'); // Get all software statements for Org
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RbAAI', 'vr1FrD2uEigYbhLqaJZeDP'); // Get software statement info
  return resp;
}

go()
  .then((out) => console.log(out))
  .catch((err) => console.log(err));
