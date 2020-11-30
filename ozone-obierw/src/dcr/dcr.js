const Http = require('ozone-http-client');
const Crypto = require('ozone-jwt');
const Validator = require('jsonschema').Validator;
const schema = require('./dcr-register-client-schema.json');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

class Dcr {
  static async registerClientRaw(params, baseFolder) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const { logLevel, ...withoutHttpParams } = params;
    const validationResult = jsonSchemaValidator.validate(withoutHttpParams, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`dcr parameters failed validation. ${validationResult.errors}`);
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation
    // send all params to http
    const oidcConfig = await fetchOidcConfig(params, baseFolder);

    // start assembling the jwt
    const now = Date.now() / 1000;

    const registrationJwt = {
      aud:  _.get(params, 'aud', oidcConfig.issuer), // use aud if specified, or default to issuer
      iat: now,
      jti: uuidv4(),
      exp: now + 300,
      software_statement: params.software_statement,
      iss: params.iss,
      redirect_uris: params.redirect_uris,
      token_endpoint_auth_method: params.token_endpoint_auth_method,
      token_endpoint_auth_signing_alg: params.token_endpoint_auth_signing_alg,
      id_token_signed_response_alg: params.id_token_signed_response_alg,
      request_object_signing_alg: params.request_object_signing_alg,
      grant_types: params.grant_types,
      scope: params.scope,
      application_type: 'web',
      backchannel_token_delivery_mode: params.backchannel_token_delivery_mode,
      backchannel_authentication_request_signing_alg: params.backchannel_authentication_request_signing_alg,
      backchannel_user_code_parameter: params.backchannel_user_code_parameter,
      backchannel_client_notification_endpoint: params.backchannel_client_notification_endpoint
    };

    // sign it
    const registrationJws = await Crypto.sign({
      'header': {
        'alg': params.registrationJws.alg,
        'kid': params.registrationJws.signingKeyKid
      },
      body: registrationJwt,
      signingKeyFileName: params.registrationJws.signingKeyFileName
    }, baseFolder);

    // submit it
    const httpParams = {
      verb: 'post',
      url: oidcConfig.registration_endpoint,
      body: registrationJws,
      headers: {
        'content-type': 'application/jwt'
      },
      certs: params.certs,
      parseJson: true,
      logLevel
    };

    // hackity hack for testing ozone on localhosts
    if (params.emulateSubject !== undefined) {
      httpParams.headers['x-cert-dn'] = params.emulateSubject;
    }

    return Http.do(httpParams, baseFolder);
  }

  static async registerClient(params, baseFolder) {
    const response = await Dcr.registerClientRaw(params, baseFolder);
    
    if ((response.status === 201) && (response.json !== undefined)) {
      return response.json;
    }

    throw new Error(response.body);
  }

  /**
   * 
   * @param {String} url 
   * @param {Object} client 
   */
  static async fetchClient(params, client) {
    const response = await executeTokenBasedOp('get', client, params);

    if ((response.status === 200) && (response.json !== undefined)) {
      return response.json;
    }

    throw new Error(response.body);
  }

  static async deleteClient(params, client) {
    const response = await executeTokenBasedOp('delete', client, params);

    if (response.status === 204) {
      return true;
    }

    throw new Error(response);
  }
}

module.exports = Dcr;

async function executeTokenBasedOp(operation, client, params) {
  const httpParams = {
    verb: operation,
    url: client.registration_client_uri,
    headers: {
      'content-type': 'application/jwt',
      'authorization': `bearer ${client.registration_access_token}`
    },
    certs: params.certs,
    parseJson: true
  };

  // hackity hack for testing ozone on localhosts
  if (params.emulateSubject !== undefined) {
    httpParams.headers['x-cert-dn'] = params.emulateSubject;
  }

  const response = await Http.do(httpParams);
  return response;
}

async function fetchOidcConfig(params, baseFolder) {
  const wkcResponse = await Http.do({ 
    url: `${params.issuer}.well-known/openid-configuration`, 
    parseJson: true, 
    logLevel: params.logLevel }, 
  baseFolder);
  if ((wkcResponse.status !== 200) || (wkcResponse.json === undefined)) {
    throw new Error(`Could not retrieve well known configuration ${wkcResponse.data}`);
  }
  const oidcConfig = wkcResponse.json;
  if (oidcConfig.registration_endpoint === undefined) {
    throw new Error('could not find registration_endpoint in oidc config');
  }

  return oidcConfig;
}

