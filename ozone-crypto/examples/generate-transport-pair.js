const fs = require('fs');
const {generateOzoneTransportCertPair} = require('..');

async function go() {
  const certAttrs = {
      softwareStatementId: 'SOFTWARE_STATEMENT_ID',
      organisationId: 'ORGANISATION_ID'
  };
  const out = await generateOzoneTransportCertPair(certAttrs);

  console.log(`Private Key: --- ${certAttrs.softwareStatementId}_transport.key ---`);
  console.log(out.privateKey);
  console.log(`Public Key: --- ${certAttrs.softwareStatementId}_transport.pem ---`);
  console.log(out.publicKey);
}

go()
  .then(out => console.log('done'))
  .catch(err => console.log(err));
