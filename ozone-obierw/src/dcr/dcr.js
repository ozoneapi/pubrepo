const Http = require('ozone-http-client');
const Crypto = require('ozone-jwt');
const Validator = require('jsonschema').Validator;
const schema = require('./dcr-register-client-schema.json');
const uuidv4 = require('uuid/v4');

class Dcr {
  static async registerClient(params) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`dcr parameters failed validation. ${validationResult.errors}`);
    }

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation

    // get the well-known configuration
    const wkcResponse = await Http.do({ url: `${params.issuer}.well-known/openid-configuration`, parseJson: true });
    if ((wkcResponse.status !== 200) || (wkcResponse.json === undefined)) {
      throw new Error(`Could not retrieve well known configuration ${wkcResponse.data}`);
    }
    const oidcConfig = wkcResponse.json;

    if (oidcConfig.registration_endpoint === undefined) {
      throw new Error('could not find registration_endpoint in oidc config');
    }

    // start assembling the jwt
    const now = Date.now() / 1000;

    const registrationJwt = {
      aud: oidcConfig.issuer,
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
    });

    // submit it
    const httpParams = {
      verb: 'post',
      url: oidcConfig.registration_endpoint,
      body: registrationJws,
      headers: {
        'content-type': 'application/jwt'
      },
      certs: params.certs,
      parseJson: true
    };

    // hackity hack for testing ozone on localhosts
    if (params.emulateSubject !== undefined) {
      httpParams.headers['x-cert-dn'] = params.emulateSubject;
    }

    const response = await Http.do(httpParams);

    if ((response.status === 201) && (response.json !== undefined)) {
      return response.json;
    }

    throw new Error(`Could not complete dynamic client registration ${response.body}`);
  }
}
module.exports = Dcr;
