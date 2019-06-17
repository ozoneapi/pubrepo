const OidcClient = require('ozone-oidc-client');
const Http = require('ozone-http-client');
const Validator = require('jsonschema').Validator;
const schema = require('../obie-config-schema.json');
const uuidv4 = require('uuid/v4');

class Payments311 {
  constructor(config) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(config, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`obie config failed validation. ${validationResult.errors}`);
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    this.config = config;
    this.oidcClient = new OidcClient(config.clientConfig);
  }

  async postSimpleDomesticPaymentsConsent(instructionIdentification, amount, sortCodeAccountNumber, creditorName) {
    const identifier = `${Date.now()}${uuidv4().substring(0, 22)}`;
    const domesticPaymentConsentRequest = {
      Data: {
        Initiation: {
          InstructionIdentification: instructionIdentification,
          EndToEndIdentification: identifier,
          InstructedAmount: {
            Amount: amount,
            Currency: 'GBP'
          },
          CreditorAccount: {
            SchemeName: 'SortCodeAccountNumber',
            Identification: sortCodeAccountNumber,
            Name: creditorName
          }
        }
      },
      'Risk': {}
    };

    const toRet = await this.postDomesticPaymentsConsent(domesticPaymentConsentRequest);
    return toRet;
  }

  async postDomesticPaymentsConsent(body, headers, token) {
    // get an access token
    if (token === undefined) {
      token = await this.oidcClient.getTokenByClientCredentialsGrant('payments');
    }

    if (token.access_token === undefined) {
      throw new Error(token);
    }

    // update the headers
    headers = this._updateHeaders(headers, token);

    const httpParams = {
      verb: 'post',
      url: `${this.config.rs}/open-banking/v3.1/pisp/domestic-payment-consents`,
      headers,
      body,
      certs: this.config.clientConfig.certs,
      parseJson: true
    };

    // make the call
    const response = await Http.do(httpParams);
    if (response.json !== undefined) {
      return response.json;
    }

    throw new Error(`failed to create payment consent ${response.data}`);
  }

  _updateHeaders(headers, token) {
    if (headers === undefined) {
      headers = {};
    }
    headers.authorization = `Bearer ${token.access_token}`;
    headers['x-fapi-financial-id'] = this.config.financialId;

    return headers;
  }
}
module.exports = Payments311;
