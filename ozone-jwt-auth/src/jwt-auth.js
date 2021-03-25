const log = require('loglevel').getLogger('ozone-jwt-auth');
const Validator = require('jsonschema').Validator;
const signingParamsSchema = require('./signing-params-schema.json');
const Jwt = require('ozone-jwt');
const HttpClient = require('ozone-http-client');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

class JwtAuth {
  static async do(httpParams, signingParams, baseFolder) {
    log.setLevel(httpParams.logLevel || 'silent');
    log.info('JwtAuth.do: started');
    log.debug('JwtAuth.do: signingParams');
    log.debug(signingParams);
    log.debug(`baseFolder: ${baseFolder}`);
    log.debug('JwtAuth.do ------------------');

    const jws = await JwtAuth.getJws(signingParams, baseFolder);
    // add to authorization header
    _.set(httpParams, 'headers.authorization', `Bearer ${jws}`);

    // do the HTTP operation
    return HttpClient.do(httpParams, baseFolder);
  }

  static async getJws(signingParams, baseFolder) {
    log.info('JwtAuth.getJws: started');

    // validate the signingParams
    log.info('JwtAuth.jws: validate signing params schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(signingParams, signingParamsSchema);
    if (validationResult.errors.length > 0) {
      log.error('JwtAuth.jws: validate signing params schema - failed');
      throw new Error(`JwtAuth.jws - signing params failed validation. ${validationResult.errors}`);
    }

    // create the Jwt body
    const jwtHeader = {
      alg: signingParams.alg,
      typ: 'JOSE',
      cty: 'json',
      kid: _.get(signingParams, 'privateKey.kid')
    };

    const now = Date.now() / 1000;

    const body = (signingParams.customClaims || {});
    body.iss = signingParams.iss;
    body.sub = signingParams.sub;
    body.aud = signingParams.aud;
    body.exp = now + signingParams.validity;
    body.iat = now;
    body.nbf = now;

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

    log.debug('JwtAuth.jws: jwt');
    log.debug(jwtSigningParams);
    log.debug('JwtAuth.jws ------------------');
    const jws = await Jwt.sign(jwtSigningParams, baseFolder);

    log.debug('JwtAuth.jws: jws');
    log.debug(jws);
    log.debug('JwtAuth.jws ------------------');

    return jws;
  }
}

module.exports = JwtAuth;
