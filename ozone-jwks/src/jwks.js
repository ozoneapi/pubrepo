const Crypto = require('ozone-crypto');
const log = require('loglevel').getLogger('ozone-jwks');
const AWS = require('aws-sdk');
const url = require('url');
const {JSONPath} = require('jsonpath-plus');
const fs = require('fs');
const request = require('https');

async function getFromS3Bucket(url, profile) {
  // connect
  const s3 = _startAWS(profile);

  const {bucket, key} = _parseUrl(url);

  const params = {
    Bucket: bucket,
    Key: key
  };

  const data = await s3.getObject(params).promise();
  return data.Body.toString('utf8');
}

async function getFromUri(url) {
  return new Promise((resolve, reject) => {
    const clientRequest = request.get(new URL(url), {rejectUnauthorized: false} , (res) => {
      res.setEncoding('utf8');
      const body = [];
      res.on('data', chunk => body.push(chunk));
      res.on('end', () => resolve(body.join('')));
    });
    clientRequest.on('error', (e) => reject(e));
  });
}

/**
 *
 * @param {string?} profile The AWS ini file profile to use
 */
function _startAWS(profile) {
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
function _parseUrl(url) {
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

async function get(url, profile) {
  const jwksPromise = url.startsWith("s3://") ? getFromS3Bucket(url, profile) : getFromUri(url);
  const jwksString = await jwksPromise;
  return JSON.parse(jwksString);
}

async function getKeyByKid(url, kid, profile) {
  const json = await get(url, profile);


  const result = JSONPath({path: `$..[?(@.kid==="${kid}")]`, json});

  if (result.length < 1) {
    throw new Error(`Could not find keys with kid ${kid}`);
  }

  return result;
}

async function _write(url, jwks, profile) {
  // connect
  const s3 = _startAWS(profile);

  const {bucket, key} = _parseUrl(url);

  const params = {
    Bucket: bucket,
    Key: key,
    ACL:'public-read',
    Body: JSON.stringify(jwks, undefined, 2)
    };

    await s3.putObject(params).promise();
}

async function init(url, profile) {
  if (!url.startsWith("s3://")) {
    throw new Error("Cannot write to non-s3 URLs")
  }

  const jwks = { keys: [] };

  await _write(url, jwks, profile);

  return jwks;
}

function _writePrivateKeyFile(fileName, keys) {
  if (fileName.endsWith('jwk') || fileName.endsWith('json')) {
    fs.writeFileSync(fileName, JSON.stringify(keys.privateKey, undefined, 2));
    return;
  }

  if (fileName.endsWith('pem') || fileName.endsWith('key')) {
    fs.writeFileSync(fileName, keys.privateKeyFile);
    return;
  }

  throw new Error(`invalid output file type - ${fileName}`);
}

/**
 *
 * @param {string} url
 * @param {integer} keySize
 * @param {string} use
 * @param {string?} fileName
 * @param {string?} profile
 */
async function addKey(url, keySize, use, fileName, profile) {
  if (!url.startsWith("s3://")) {
    throw new "URL is not a S3 bucket. Cannot add key to source file. Aborting."
  }

  const jwks = await get(url, profile);

  // create a key
  const newKeys = await Crypto.generateRSAKeyPair(keySize, use);

  // inject in jwks
  jwks.keys.push(newKeys.publicKey);

  await Jwks._write(url,jwks, profile );

  // write the files if required
  if (fileName === undefined) {
    return newKeys;
  } else {
    _writePrivateKeyFile(fileName, newKeys);
    return newKeys.publicKey;
  }
}

module.exports = {
  init, get, addKey, getKeyByKid
};
