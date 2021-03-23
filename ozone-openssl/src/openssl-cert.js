const openssl = require('./openssl')
const fsPromises = require("fs").promises;
const fs = require('fs');
const AdmZip = require('adm-zip');
const makeDir = require("make-dir");
const del = require("del");

class OpenSSLCert {

    /**
     *  Function to generete key, csr, crt and pen file
     *
     * @static
     * @param {string} certPath 
     * @param {any} options
     * @return {Promise<[]>}
     * @memberof OpenSSLCert
     */
    static async generate(certPath, options) {
        console.log(`Creating ${options.type} Certificate`);
        return new Promise(async (resolve, reject) => {
            const certDir = `${options.softwareStatementId}_${options.organizationId}`;
            await OpenSSLCert.clean(`./${certPath}/${certDir}/`);
            const keyFile = `./${certPath}/${certDir}/${options.softwareStatementId}_${options.type}.key`;
            const csrFile = `./${certPath}/${certDir}/${options.softwareStatementId}_${options.type}.csr`;
            const crtFile = `./${certPath}/${certDir}/${options.softwareStatementId}_${options.type}.crt`;
            const pemFile = `./${certPath}/${certDir}/${options.softwareStatementId}_${options.type}.pem`;
            await OpenSSLCert.run(`genrsa -out ${keyFile} 2048`);
            await OpenSSLCert.chmod(`${keyFile}`)
            await OpenSSLCert.run(`req -new -out ${csrFile} -key ${keyFile} -subj /C=MX/O=OpenBanking/OU=${options.organizationId}/CN=${options.softwareStatementId}`);
            await OpenSSLCert.run(`x509 -req -days 365 -in ${csrFile} -signkey ${keyFile} -sha256 -out ${crtFile}`);
            await OpenSSLCert.run(`openssl x509 -in ${crtFile} -out ${pemFile} -outform PEM`);

            resolve([keyFile, pemFile]);
        });
    }



    /**
     * Function will upload the cert to the designated S3 bucket.
     *
     * @static
     * @param {string} cert
     * @memberof OpenSSLCert
     * @TODO
     */
    static upload(cert) {
        throw new Error('Method not implemented');
    }


    /**
     *  Function run trigger the openssl commend
     *
     * @static
     * @param {string} command
     * @return {Promise<boolean>} 
     * @memberof OpenSSLCert
     */
    static async run(command) {
        return new Promise((resolve, reject) => {
            openssl(command, (err, buffer) => {
                resolve(true);
            });
        });
    }


    /**
     *
     * Function to change the permission on the file so
     * it can be read via filesystem
     * @static
     * @param {string} fileName
     * @return {Promise<boolean>} 
     * @memberof OpenSSLCert
     */
    static async chmod(fileName) {
        return new Promise((resolve, reject) => {
            try {
                fs.chmod(fileName, 0o775, (err) => {
                    if (err) throw err;
                    console.log(`The permissions for file ${fileName} have been changed!`);
                    resolve(true);
                });
            } catch (error) {
                console.log(error);
                reject(true);
            }
        })
    }

    static zip(files, fileName) {
        var zip = new AdmZip();
        files.forEach((file, i) => {
            zip.addLocalFile(file);
        })

        zip.writeZip(fileName);
    }


    /**
     * Function to create a folder so all certificate
     * related to organization and softwarestatement 
     * are generated a same folder. If the folder exists
     * it will fisrt delete existing once.
     *
     * @static
     * @param {string} directoryName
     * @return {Promise<any>} 
     * @memberof OpenSSLCert
     */
    static async clean(directoryName) {
        // await del([directoryName]);
        return makeDir(directoryName);
    }
}
module.exports = OpenSSLCert;