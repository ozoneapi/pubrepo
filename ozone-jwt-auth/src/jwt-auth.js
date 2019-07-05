const log = require('loglevel').getLogger('ozone-jwt-auth');
const Validator = require('jsonschema').Validator;
const signingParamsSchema = require('./signing-params-schema.json');
const Jwt = require('ozone-jwt');
const HttpClient = require('ozone-http-client');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

class JwtAuth {
  static async do(httpParams, signingParams) {
    log.setLevel(httpParams.logLevel || 'silent');

    log.info('JwtAuth.do: started');
    log.debug('JwtAuth.do: signingParams');
    log.debug(signingParams);
    log.debug('JwtAuth.do ------------------');

    // validate the signingParams
    log.info('JwtAuth.do: validate signing params schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(signingParams, signingParamsSchema);
    if (validationResult.errors.length > 0) {
      log.error('JwtAuth.do: validate signing params schema - failed');
      throw new Error(`JwtAuth.do - signing params failed validation. ${validationResult.errors}`);
    }

    // create the Jwt body
    const jwtHeader = {
      alg: signingParams.alg,
      typ: 'JOSE',
      cty: 'json',
      kid: signingParams.privateKey.kid,
    };

    const now = Date.now() / 1000;
    const body = {
      iss: signingParams.iss,
      sub: signingParams.sub,
      exp: now + signingParams.validity,
      iat: now,
      nbf: now
    };

    if (signingParams.jti === undefined) {
      body.jti = uuidv4();
    } else {
      body.jti = signingParams.jti;
    }

    // sign it
    const jwtSigningParams = {
      header: jwtHeader,
      body,
      signingKeyJwk: signingParams.privateKey
    };

    log.debug('JwtAuth.do: jwt');
    log.debug(jwtSigningParams);
    log.debug('JwtAuth.do ------------------');
    const authHeader = await Jwt.sign(jwtSigningParams);

    log.debug('JwtAuth.do: jws');
    log.debug(authHeader);
    log.debug('JwtAuth.do ------------------');

    // add to authorization header
    _.set(httpParams, 'headers.authorization', `Bearer ${authHeader}`);

    // do the HTTP operation
    return HttpClient.do(httpParams);
  }
}

module.exports = JwtAuth;
