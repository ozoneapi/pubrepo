const OidcClient = require('ozone-oidc-client');
const Http = require('ozone-http-client');
const Validator = require('jsonschema').Validator;
const schema = require('../obie-config-schema.json');
const uuidv4 = require('uuid/v4');
const Signature31 = require('../sigs/signature-31.js');


class Payments311 {
  constructor(config, baseFolder) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(config, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`obie config failed validation. ${validationResult.errors}`);
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    this.config = config;
    this.baseFolder = baseFolder;
    this.oidcClient = new OidcClient(config.clientConfig, baseFolder);
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


  async postSimpleDomesticPayment(token, domesticPaymentConsentResponse) {
    const domesticPaymentRequest = {
      Data: {
        ConsentId: domesticPaymentConsentResponse.Data.ConsentId,
        Initiation: domesticPaymentConsentResponse.Data.Initiation
      },
      Risk: {}
    };

    const toRet = await this.postDomesticPayments(domesticPaymentRequest, undefined, token);
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

    // sign the message
    const sig = new Signature31(this.config, this.baseFolder);
    const bodyToStream = JSON.stringify(body);
    const signature = await sig.sign(bodyToStream, 'json');    
    
    // update the headers
    headers = this._updateHeaders(headers, token, signature);

    const httpParams = {
      verb: 'post',
      url: `${this.config.rs}/open-banking/v3.1/pisp/domestic-payment-consents`,
      headers,
      body: bodyToStream,
      certs: this.config.clientConfig.certs,
      parseJson: true
    };


    // make the call
    const response = await Http.do(httpParams, this.baseFolder);
    if (response.json !== undefined) {
      return response.json;
    }

    throw new Error(`failed to create payment consent ${response.data}`);
  }

  _updateHeaders(headers, token, signature) {
    console.log(signature);
    if (headers === undefined) {
      headers = {};
    }
    headers.authorization = `Bearer ${token.access_token}`;
    headers['x-fapi-financial-id'] = this.config.financialId;
    headers['x-jws-signature'] = signature;
    headers['content-type'] = 'application/json';

    return headers;
  }

  async postDomesticPayments(body, headers, token) {
    if (token.access_token === undefined) {
      throw new Error('invalid access token');
    }

    // update the headers
    headers = this._updateHeaders(headers, token);

    const httpParams = {
      verb: 'post',
      url: `${this.config.rs}/open-banking/v3.1/pisp/domestic-payments`,
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

    throw new Error(`failed to post payment ${response.data}`);
  }
}
module.exports = Payments311;
