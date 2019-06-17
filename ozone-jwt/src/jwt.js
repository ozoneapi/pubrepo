const jwtSignSchema = require('./jwt-sign.json');
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const jws = require('jws');
const jose = require('node-jose');
const log = require('loglevel');

class Jwt {
  static async sign(params) {
    log.setLevel(params.logLevel || 'silent');

    log.info('Jwt.sign: Started Jwt.sign with params:');
    log.info(params);
    log.info('Jwt.sign: -----------------------------');

    // validate the params
    log.debug('Jwt.sign: validating schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, jwtSignSchema);
    if (validationResult.errors.length > 0) {
      log.error('Jwt.sign: validating schema - failed');
      throw new Error(`Jwt.sign - params failed validation. ${validationResult.errors}`);
    }
    log.debug('Jwt.sign: validating schema - done');

    let toRet;
    switch (params.header.alg) {
      case 'none':
      case 'HS256':
        toRet = Jwt._signSym(params);
        break;

      default:
        toRet = await Jwt._signAsym(params);
    }

    log.info('Jwt.sign: returning');
    log.info(toRet);
    log.info('Jwt.sign: -----------------------------');
    return toRet;
  }

  static _signSym(params) {
    log.debug('Jwt.sign: signing with symmetric key - start');
    return jws.sign({
      header: params.header,
      payload: params.body,
      secret: params.secret
    });
  }

  static async _getSigningKey(params) {
    log.debug('Jwt.sign: retrieving signing key - start');

    if (params.signingKeyFileName !== undefined) {
      log.debug(`Jwt.sign: using signing key file ${params.signingKeyFileName}`);
      const key = fs.readFileSync(params.signingKeyFileName, 'utf8');
      const privateKey = await jose.JWK.asKey(key, 'pem');
      return privateKey;
    }

    if (params.signingKeyPEM !== undefined) {
      log.debug(`Jwt.sign: using PEM ${params.signingKeyPEM.substring(0, 20)}`);
      const key = params.signingKeyPEM;
      const privateKey = await jose.JWK.asKey(key, 'pem');
      return privateKey;
    }

    // if (params.jwk !== undefined) {
    //   const keyStore = await jose.JWK.asKeyStore(params.jwk);
    //   this.privateKeyKid = json.keys[0].kid;
    //   this.privateKey = keyStore.get(this.privateKeyKid);
    //
    //   // req.logger.log(jwt);
    //   // req.logger.log(`${jwt}`);
    //   // const toRet = await crypto.sign(JSON.stringify(jwt), 'PS256');
    //
    // }

    throw new Error('signingKeyFileName or signingKeyPEM must be specified for asymmetric algorithms');
  }

  static async _signAsym(params) {
    log.debug('Jwt.sign: signing with Asymmetric key');
    const privateKey = await Jwt._getSigningKey(params);

    // sign
    const signatureConfig = {
      fields: params.header,
      format: 'compact'
    };

    log.debug('Jwt.sign: creating signature - start');
    const toRet = await jose.JWS.createSign(signatureConfig, privateKey)
      .update(JSON.stringify(params.body), 'utf8')
      .final();
    log.debug('Jwt.sign: creating signature - done');

    return toRet;
  }
}

module.exports = Jwt;
