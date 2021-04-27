var forge = require('node-forge');
// TODO: Test with pure implementation only if native does not work
// forge['options'].usePureJavaScript = true;

/** @typedef {{
 *  softwareStatementId: string,
 *  organisationId: string,
 *  country?: string,
 *  issuingOrg?: string,
 *  type?: string,
 *  keySize?: '2048'|'4096',
 *  validDays?: string
 * }} CertAttributes 
 */

/** @type {Omit<CertAttributes, 'softwareStatementId'|'organisationId'>} */
const CERT_DEFAULT_ATTRS = {
    country: 'UK',
    issuingOrg: 'OpenBanking',
    type: 'transport',
    keySize: '2048',
    validDays: '365',
};

/** @type {CertAttributes} */
const CERT_ATTR_MAPPER = {
    country: 'C',
    issuingOrg: 'O',
    organisationId: 'OU',
    softwareStatementId: 'CN'
}

/**
 * 
 * @param {CertAttributes} certAttrs 
 * @returns {CertAttributes}
 */
function validateAttrs(certAttrs) {
    if (!certAttrs.softwareStatementId || !certAttrs.organisationId) {
        throw new Error('Missing mandatory information about Ozone Transport Certificate generation.')
    }

    return { ...CERT_DEFAULT_ATTRS, ...certAttrs };
}

/**
 * 
 * @param {import('node-forge').pki.Certificate} cert 
 * @param {CertAttributes} attrs 
 */
function populateCert(cert, attrs) {
    /** @typedef {import('node-forge').pki.CertificateField} CertificateField */
    /** @type {CertificateField[]} */
    const subject = Object.entries(attrs)
        .filter(([name]) => CERT_ATTR_MAPPER[name])
        .map(([name, value]) => {
            return { shortName: CERT_ATTR_MAPPER[name], value }
        });
    cert.setSubject(subject);
    cert.setIssuer(subject);
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + Number(attrs.validDays));
}

/** @type {(certAttrs: CertAttributes) => Promise<{privateKey: string, publicCertPem:string}>} */
async function generateOzoneTransportCertPair(certAttrs) {
    // const attrs = validateAttrs(certAttrs);
    const attrs = { organisationId: certAttrs.organisationId };
    var pki = forge.pki;
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    populateCert(cert, attrs);
    cert.sign(keys.privateKey);

    var pem_publicKey = pki.certificateToPem(cert);
    var pem_privateKey = pki.privateKeyToPem(keys.privateKey);

    return { publicCertPem: pem_publicKey, privateKey: pem_privateKey };
}

module.exports = generateOzoneTransportCertPair;
