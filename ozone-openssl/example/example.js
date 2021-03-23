const OpenSSLCert = require('../src/openssl-cert.js');


(async () => {
    const transportCerts = await OpenSSLCert.generate("certs", {
        softwareStatementId: "ABC",
        organizationId: "Gaurav",
        type: "transport"
    });

    OpenSSLCert.zip(transportCerts.concat(signingCerts), "./certs/ABC_Gaurav/ABC.zip")
})();
