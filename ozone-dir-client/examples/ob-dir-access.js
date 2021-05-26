const OidcClient = require('ozone-oidc-client');
const fs = require('fs');
const clientConfig = require('./config/config-obie-directory.json');
const OBDirClient = require('../src/ob-dir-client');

async function go() {
  const obDirClient = new OBDirClient(clientConfig);
  const oidcClient = new OidcClient(clientConfig.oidcClient);

  const token = await oidcClient.getTokenByClientCredentialsGrant(clientConfig.oidcClient.scope);
  console.log(token);

  const resp = await obDirClient.getScimResource('tpp', token,  '0015800001ZEc3hAAD');
  console.log(resp);

  // const resp = await obDirClient.getResource('organisation', token, 'tpp', '0015800001041RHAAY');
  // console.log(resp);

  // const resp = await obDirClient.getResource('organisation', token, 'tpp'); // Get all TPPs
  //const resp = await obDirClient.getResource('organisation', token, 'tpp', '0015800001ZEc3hAAD'); //Get TPP info
  //const resp = await obDirClient.getResource('organisation', token, 'aspsp'); // Get all aspsps
  //const resp = await obDirClient.getResource('organisation', token, 'aspsp', '0015800001ZEc3hAAD'); // Get aspsp info
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RHAAY'); // Get all software statements for Org
  //const resp = await obDirClient.getResource('software-statement', token, 'aspsp', '0015800001041RbAAI', 'vr1FrD2uEigYbhLqaJZeDP'); // Get software statement info

  // const cert = fs.readFileSync('/usr/o3/monese-connectors/crypto/prod/transport-monese-prod.pem');
  // let response = await obDirClient.validateCert(token, cert); // ValidateCertificate
  // console.log(response);

  // _chkcert(response.data.certificate)
  // await sleep(2000);
  // response = await obDirClient.validateCert(token, cert); // ValidateCertificate
  // _chkcert(response.data.certificate)
  // await sleep(2000);
  // response = await obDirClient.validateCert(token, cert); // ValidateCertificate
  // _chkcert(response.data.certificate)
  // await sleep(2000);
  // response = await obDirClient.validateCert(token, cert); // ValidateCertificate
  // _chkcert(response.data.certificate)
  // return "done";

  // console.log(resp);
}

  function _chkcert(certificate) {
    if (certificate === undefined) {
      console.log('Error certificate undefined');
    }
    console.log('type:' + certificate.type);
    console.log('eidas:' + certificate.valid_eidas_certificate);
    console.log('obietf:' + certificate.valid_obietf_certificate);
    console.log('expired:' + certificate.expired);
    console.log('revoked:' + certificate.revoked);
    console.log('-----');
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

go()
  .then((out) => console.log(out))
  .catch((err) => console.log(err));
