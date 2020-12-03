/* eslint-disable class-methods-use-this */
const Http = require('ozone-http-client');
const { Validator } = require('jsonschema');
const schema = require('./ob-dir-config-schema.json');

class OBDirClient {
  constructor(config) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(config, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(
        `obie config failed validation. ${validationResult.errors}`
      );
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    this.config = config;
  }

  async getScimResource(resource, token, id) {
    const headers = this._updateHeaders(undefined, token);

    const httpParams = {
      verb: 'get',
      url: OBDirClient.getScimResourceUri(this.config.baseScimUri, resource, id),
      headers,
      parseJson: true,
      certs: this.config.oidcClient.certs,
      logLevel: this.config.oidcClient.logLevels.http,
    };

    return Http.do(httpParams, this.baseFolder);
  }

  async getResource(resource, token, type, id, ssa) {
    const headers = this._updateHeaders(undefined, token);

    const httpParams = {
      verb: 'get',
      url: OBDirClient.getResourceUri(this.config.baseRestUri, resource, type, id, ssa),
      headers,
      parseJson: true,
      certs: this.config.oidcClient.certs,
      logLevel: this.config.oidcClient.logLevels.http,
    };
    console.log(httpParams.url);
    return Http.do(httpParams, this.baseFolder);
  }

  _updateHeaders(headers, token) {
    if (headers === undefined) {
      headers = {};
    }
    headers.authorization = `Bearer ${token.access_token}`;

    return headers;
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
}
module.exports = OBDirClient;
