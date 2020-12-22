const OidcClient = require('ozone-oidc-client');
const Http = require('ozone-http-client');
const fs = require('fs');
const clientConfig = require('./config/cli-config-oz.js');
const OBDirClient = require('../src/ob-dir-client');
const minimist = require('minimist');
const { allowedNodeEnvironmentFlags } = require('process');

async function go() {

  // ensure OZONE_HOME is defined
  const {OZONE_HOME} = process.env;
  if (!OZONE_HOME) {
    throw new Error('OZONE_HOME env variable not found');
  }

  // cli
  const args = minimist(process.argv.slice(2));

  if (args['?'] !== undefined) {
    console.log('node obdlookup.js <operation> --id id --debug info|debug|error');
    console.log('operations: tpp');
  }

  if (args.debug === undefined) {
    args.debug = 'error';
  }

  console.log(args);


  if (args._.length !== 1) {
    throw new Error('You must pass in an operation. -? for help');
  }

  const config = clientConfig(args);

  const obDirClient = new OBDirClient(config);
  const oidcClient = new OidcClient(config.oidcClient);

  const token = await oidcClient.getTokenByClientCredentialsGrant('AuthoritiesReadAccess ASPSPReadAccess TPPReadAll');

  if (token.error !== undefined) {
    throw new Error(`Could not get access token. ${token.error}: ${token.error_description}`);
  }

  
  const operation = args._[0];

  switch (operation) {
    case 'tpp':
      if (args.id === undefined) {   
        return obDirClient.getResource('organisation', token, 'tpp');
      } else {
        return obDirClient.getScimResource('tpp', token, args.id); //eg 0015800001ZEc3hAAD
      }

    case 'cert':

      const cert = fs.readFileSync("C:\\Users\\fgyara\\Downloads\\lXmxiuVQSG1WbdiWYuPtm2MYv-0.pem");
      
      
      // const cert = fs.readFileSync(`${config.oidcClient.certs.cert}`);
      const resp = await obDirClient.validateCert(token, cert); // ValidateCertificate
      return resp.json;
    
    default:
      throw new Error(`Invalid operation ${operation}. -? for help`);
  }
  

  //const resp = await obDirClient.getScimResource('tpp', token, '0015800001ZEc3hAAD');

  //const resp = await obDirClient.getResource('organisation', token, 'tpp'); // Get all TPPs
  //const resp = await obDirClient.getResource('organisation', token, 'tpp', '0015800001ZEc3hAAD'); //Get TPP info
  //const resp = await obDirClient.getResource('organisation', token, 'aspsp'); // Get all aspsps
  //const resp = await obDirClient.getResource('organisation', token, 'aspsp', '0015800001ZEc3hAAD'); // Get aspsp info
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RHAAY'); // Get all software statements for Org
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RbAAI', 'vr1FrD2uEigYbhLqaJZeDP'); // Get software statement info

}

go()
  .then((out) => console.log(JSON.stringify(out, undefined, 2)))
  .catch((err) => console.log(err));

