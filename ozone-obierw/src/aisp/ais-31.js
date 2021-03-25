const OidcClient = require('ozone-oidc-client');
const Http = require('ozone-http-client');
const Validator = require('jsonschema').Validator;
const schema = require('../obie-config-schema.json');
const { v4: uuidv4 } = require('uuid');

class Ais31 {
  constructor(config, baseFolder) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(config, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`obie config failed validation. ${validationResult.errors}`);
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    this.config = config;
    this.oidcClient = new OidcClient(config.clientConfig, baseFolder);
    this.baseFolder = baseFolder;
  }

  async createConsent(body, headers, token) {
    const response = await this.createConsentRaw(body, headers, token);

    if ((response.status === 201) && (response.json !== undefined)) {
      return response.json;
    }

    throw new Error(`failed to create account access consent ${JSON.stringify(response.json)}`);
  }

  async createConsentRaw(body, headers, token) {
    // get an access token
    if (token === undefined) {
      token = await this.oidcClient.getTokenByClientCredentialsGrant('accounts');
      if (token.access_token === undefined) {
        throw new Error(JSON.stringify(token));
      }
    }

    // update the headers
    headers = this._updateHeaders(headers, token);

    const httpParams = {
      verb: 'post',
      url: `${this.config.rs}/open-banking/v3.1/aisp/account-access-consents`,
      headers,
      body,
      certs: this.config.clientConfig.certs,
      parseJson: true
    };

    // make the call
    return Http.do(httpParams, this.baseFolder);
  }

  async getConsent(consentId, token) {
    return this._doConsent('get', consentId, token);
  }

  async deleteConsent(consentId, token) {
    return this._doConsent('delete', consentId, token);
  }

  async _doConsent(verb, consentId, token) {
    const response = await this._doConsentRaw(verb, consentId, token);
    if (response.json !== undefined) {
      return response.json;
    }

    throw new Error(`failed to ${verb} account access consent ${response.data}`);    
  }

  async getConsentRaw(consentId, token) {
    return this._doConsentRaw('get', consentId, token);
  }

  async deleteConsentRaw(consentId, token) {
    return this._doConsentRaw('delete', consentId, token);
  }

  async _doConsentRaw(verb, consentId, token) {
    // get an access token
    if (token === undefined) {
      token = await this.oidcClient.getTokenByClientCredentialsGrant('accounts');
      if (token.access_token === undefined) {
        throw new Error(token);
      }
    }

    const headers = this._updateHeaders(undefined, token);

    const httpParams = {
      verb,
      url: `${this.config.rs}/open-banking/v3.1/aisp/account-access-consents/${consentId}`,
      headers,
      certs: this.config.clientConfig.certs,
      parseJson: true
    };

    // make the call
    return Http.do(httpParams, this.baseFolder);
  }

  _updateHeaders(headers, token) {
    if (headers === undefined) {
      headers = {};
    }
    headers.authorization = `Bearer ${token.access_token}`;
    headers['x-fapi-financial-id'] = this.config.financialId;

    return headers;
  }

  static getResourceUri(baseUri, resource, accountId) {
    let toRet;
    switch (resource) {
      case 'accounts':
        if (accountId) {
          toRet = `${baseUri}/open-banking/v3.1/aisp/accounts/${accountId}`;
        } else {
          toRet = `${baseUri}/open-banking/v3.1/aisp/accounts`;
        }
        break;

      default:
        if (accountId) {
          toRet = `${baseUri}/open-banking/v3.1/aisp/accounts/${accountId}/${resource}`;
        } else {
          toRet = `${baseUri}/open-banking/v3.1/aisp/${resource}`;
        }
        break;
    }

    return toRet;
  }

  async getAisResource(resource, token, accountId) {

    const headers = this._updateHeaders(undefined, token);

    const httpParams = {
      verb: 'get',
      url: Ais31.getResourceUri(this.config.rs, resource, accountId),
      headers,
      certs: this.config.clientConfig.certs,
      parseJson: true
    };    

    // make the call
    return Http.do(httpParams, this.baseFolder);
  }

}
module.exports = Ais31;
