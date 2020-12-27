const Crypto = require('ozone-crypto');
const log = require('loglevel').getLogger('ozone-jwks');
const AWS = require('aws-sdk');
const url = require('url');
const {JSONPath} = require('jsonpath-plus');

class Jwks {

  /**
   * 
   * @param {string?} profile The AWS ini file profile to use
   */
  static _startAWS(profile) {
    if (profile !== undefined) {
      log.debug(`Using profile ${profile}`);
      AWS.config.credentials = new AWS.SharedIniFileCredentials({profile});
    } else {
      log.debug('AWS profile not specified - none set');
    }

    return new AWS.S3({ apiVersion: '2006-03-01' });
  }

  /**
   * 
   * @param {string?} url 
   *  
   */
  static _parseUrl(url) {
    log.debug(`parsing url ${url}`);

    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== 's3:') {
      throw new Error(`Expected URL with a protocol of s3 (ie starting with s3://) but got ${parsedUrl.protocol}`);
    }

    if (parsedUrl.pathname === undefined) {
      throw new Error('URL must have a path element');
    }

    let pathName = parsedUrl.pathname;
    if (pathName.startsWith('/')) { pathName = pathName.substring(1) }
    if (pathName.endsWith('/')) { pathName = pathName.substring(0, pathName.length-1) }

    const toRet = { bucket: parsedUrl.host, key: pathName };
    log.debug(`Returning ${JSON.stringify(toRet)}`)
    return toRet;
  }

  static async get(url, profile) {
    // connect
    const s3 = Jwks._startAWS(profile);

    const {bucket, key} = Jwks._parseUrl(url);

    const params = {
      Bucket: bucket, 
      Key: key
     };

     const data = await s3.getObject(params).promise();

     const jwksString = data.Body.toString('utf8');

     return JSON.parse(jwksString);
  }

  static async getKeyByKid(url, kid, profile) {
    const json = await Jwks.get(url, profile);


    const result = JSONPath({path: `$..[?(@.kid==="${kid}")]`, json});

    if (result.length < 1) {
      throw new Error(`Could not find keys with kid ${kid}`);
    }

    return result;
  }

  static async _write(url, jwks, profile) {
    // connect
    const s3 = Jwks._startAWS(profile);

    const {bucket, key} = Jwks._parseUrl(url);

    const params = {
      Bucket: bucket, 
      Key: key,
      Body: JSON.stringify(jwks)
     };

     await s3.putObject(params).promise();
  }

  static async init(url, profile) {

    const jwks = { keys: [] };

    await Jwks._write(url, jwks, profile);

    return jwks;
  }

  static async addKey(url, keySize, use, profile) {
    const jwks = await Jwks.get(url, profile);
    
    // create a key
    const {publicKey, privateKey} = await Crypto.generateRSAKeyPair(keySize, use);

    // inject in jwks
    jwks.keys.push(publicKey);

    log.debug(JSON.stringify(privateKey, undefined, 2));

    await Jwks._write(url,jwks, profile );

    return privateKey;
  }

  static async deleteKey(url, kid) {
    
  }

  static async moveKey(fromUrl, toUrl, kid) {

  }
}

module.exports = Jwks;
