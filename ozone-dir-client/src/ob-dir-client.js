/* eslint-disable class-methods-use-this */
const log = require('loglevel').getLogger('ozone-dir-client');
const Http = require('ozone-http-client');
const { Validator } = require('jsonschema');
const schema = require('./ob-dir-config-schema.json');
const _ = require('lodash');
const NodeCache = require('node-cache');
const crypto = require('crypto');

class OBDirClient {
  constructor(params) {
    log.setLevel(params.logLevel || 'silent');
    log.debug(params);
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(
        `obie config failed validation. ${validationResult.errors}`
      );
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    const stdTTL = params.ttl;
    this.cache = new NodeCache({
      stdTTL,
      checkperiod: stdTTL,
      useClones: true,
      deleteOnExpire: true
    });

    this.config = params;
  }

  async getScimResource(resource, token, id) {
    const headers = this._updateHeaders(undefined, token);
    const httpParams = {
      verb: 'get',
      url: OBDirClient.getScimResourceUri(this.config.baseScimUri, resource, id),
      headers,
      parseJson: true,
      certs: this.config.oidcClient.certs,
      logLevel: this.config.oidcClient.logLevels.http
    };

    return Http.do(httpParams, this.baseFolder);
  }

  async getResource(resource, token, type, id, ssa) {
    const headers = this._updateHeaders(undefined, token);
    const url = OBDirClient.getResourceUri(this.config.baseRestUri, resource, type, id, ssa);

    let cachedJson = this._getCache(url);

    if (cachedJson === undefined) {
      const httpParams = {
        verb: 'get',
        url: url,
        headers,
        parseJson: true,
        certs: this.config.oidcClient.certs,
        logLevel: this.config.oidcClient.logLevels.http
      };
      let response = await Http.do(httpParams, this.baseFolder);
      if (response.json !== undefined) {
        if (response.status === 200) {
          this.cache.set(url, response.json);
        }
        return response.json;
      }
    } else {
      return cachedJson;
    }
  }

  async validateCert(token, pemBytes) {
    const headers = this._updateHeaders(undefined, token);
    headers['content-type'] = 'application/x-pem-file';

    let certHash = this._hashCert(pemBytes);
    let cachedJson = this._getCache(certHash);

    if (cachedJson === undefined) {
      const httpParams = {
        verb: 'post',
        url: OBDirClient.getResourceUri(this.config.baseRestUri, 'certificate'),
        headers,
        body: pemBytes,
        parseJson: true,
        certs: this.config.oidcClient.certs,
        logLevel: this.config.oidcClient.logLevels.http
      };
       let certResponse = await Http.do(httpParams, this.baseFolder);
       if (certResponse.status === 200) 
        if (certResponse.json !== undefined) {
           this.cache.set(certHash, certResponse.json);
        }        
        return certResponse.json;       
     } else {
       console.log('used cached validate response');
       return cachedJson;
     }
  }

  _updateHeaders(headers, token) {
    if (headers === undefined) {
      headers = {};
    }
    headers.authorization = `Bearer ${token.access_token}`;

    return headers;
  }

  _hashCert(pemBytes) {
    let hash = crypto.createHash('sha256');
    let hash_update = hash.update(pemBytes,'utf-8');
    return hash_update.digest('hex')
  }

  static getResourceUri(baseUri, resource, type, id, ssid) {
    let toRet;
    switch (resource) {
      case 'organisation':
        if (type === 'aspsp' || type === 'tpp') {
          if (id) {
            toRet = `${baseUri}/organisation/${type}/${id}`;
          } else {
            toRet = `${baseUri}/organisation/${type}`;
          }
        } else {
          throw new Error(
            `OBDirClient - undefined type in getResourceUri: ${type}`
          );
        }
        break;

      case 'software-statement':
        if (type === 'aspsp' || type === 'tpp') {
          if (id === undefined) {
            throw new Error(`OBDirClient - undefined id in getResourceUri software-statement: ${id}`);
          }
          if (ssid) {
            toRet = `${baseUri}/organisation/${type}/${id}/software-statement/${ssid}`;
          } else {
            toRet = `${baseUri}/organisation/${type}/${id}/software-statement`;
          }
        } else {
          throw new Error(`OBDirClient - undefined type in getResourceUri: ${type}`);
        }
        break;

      case 'certificate':
        toRet = `${baseUri}/certificate/validate`;
        break;

      default:
        throw new Error(`OBDirClient - undefined resource in getResourceUri: ${resource}`);
    }
    return toRet;
  }

  static getScimResourceUri(baseUri, resource, id) {
    let toRet;
    switch (resource) {
      case 'tpp':
        if (id) {
          toRet = `${baseUri}/OBThirdPartyProviders/${id}`;
        } else {
          toRet = `${baseUri}/OBThirdPartyProviders`;
        }
        break;

      case 'aspsp':
        if (id) {
          toRet = `${baseUri}/OBAccountPaymentServiceProviders/${id}`;
        } else {
          toRet = `${baseUri}/OBAccountPaymentServiceProviders`;
        }
        break;

      case 'qtsp':
        if (id) {
          toRet = `${baseUri}/OBQualifiedTrustServiceProviders/${id}`;
        } else {
          toRet = `${baseUri}/OBQualifiedTrustServiceProviders`;
        }
        break;

      case 'authorities':
        if (id) {
          toRet = `${baseUri}/OBAuthorities/${id}`;
        } else {
          toRet = `${baseUri}/OBAuthorities`;
        }
        break;

      default:
        throw new Error(
          `OBDirClient - undefined resource in getScimResourceUri: ${resource}`
        );
    }

    return toRet;
  }

  _getCache(key) {
    let value = this.cache.get(key);
    if (value === undefined) {
      log.debug(`cache miss ${key}`);
      return value
    }
    log.debug(`using cached value for key ${key}`);
    return value;
  }

}
module.exports = OBDirClient;
