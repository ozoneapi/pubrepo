const jwtSignSchema = require('./jwt-sign.json');
const jwtVerifySchema = require('./jwt-verify.json');
const Validator = require('jsonschema').Validator;
const fs = require('fs');
const jws = require('jws');
const jose = require('node-jose');
const log = require('loglevel').getLogger('ozone-jwt');
const Http = require('ozone-http-client');

class Jwt {
  static async sign(params) {
    log.debug('Jwt.sign: Started Jwt.sign with params:');
    log.debug(params);
    log.debug('Jwt.sign: -----------------------------');

    // validate the params
    log.info('Jwt.sign: validating schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, jwtSignSchema);
    if (validationResult.errors.length > 0) {
      log.error('Jwt.sign: validating schema - failed');
      throw new Error(`Jwt.sign - params failed validation. ${validationResult.errors}`);
    }
    log.info('Jwt.sign: validating schema - done');

    let signature;
    log.info(`Jwt.sign: alg is ${params.header.alg}`);
    switch (params.header.alg) {
      case 'none':
      case 'HS256':
        log.info('Jwt.sign: signing with a symmetric algorithm');
        signature = Jwt._signSym(params);
        break;

      default:
        log.info('Jwt.sign: signing with an asymmetric algorithm');
        signature = await Jwt._signAsym(params);
    }

    log.debug('Jwt.sign: returning');
    const signatureParts = signature.split('.');
    log.debug(`header: ${signatureParts[0]}`);
    log.debug(`body: ${signatureParts[1]}`);
    log.debug(`signature: ${signatureParts[2]}`);
    log.debug('Jwt.sign: -----------------------------');
    return signature;
  }

  static _signSym(params) {
    return jws.sign({
      header: params.header,
      payload: params.body,
      secret: params.secret
    });
  }

  static async _getSigningKey(params) {
    log.info('Jwt._getSigningKey: retrieving signing key - start');

    if (params.signingKeyFileName !== undefined) {
      log.info(`Jwt._getSigningKey: using signing key file ${params.signingKeyFileName}`);
      const key = fs.readFileSync(params.signingKeyFileName, 'utf8');
      const privateKey = await jose.JWK.asKey(key, 'pem');
      return privateKey;
    }

    if (params.signingKeyPEM !== undefined) {
      log.info(`Jwt._getSigningKey: using PEM ${params.signingKeyPEM.substring(0, 60)}...`);
      const key = params.signingKeyPEM;
      const privateKey = await jose.JWK.asKey(key, 'pem');
      return privateKey;
    }

    if (params.signingKeyJwk !== undefined) {
      log.info(`Jwt._getSigningKey: using JWK with kid ${params.signingKeyJwk.kid}`);
      const privateKey = await jose.JWK.asKey(params.signingKeyJwk);
      return privateKey;
    }

    throw new Error('signingKeyFileName or signingKeyPEM must be specified for asymmetric algorithms');
  }

  static async _signAsym(params) {
    log.info('Jwt._signAsym: signing with asymmetric key');
    const privateKey = await Jwt._getSigningKey(params);

    // sign
    const signatureConfig = {
      fields: params.header,
      format: 'compact'
    };
    log.debug('Jwt._signAsym - signatureConfig');
    log.debug(signatureConfig);
    log.debug('Jwt._signAsym -----------------');

    log.info('Jwt._signAsym: creating signature - start');
    const toRet = await jose.JWS.createSign(signatureConfig, privateKey)
      .update(JSON.stringify(params.body), 'utf8')
      .final();
    log.info('Jwt._signAsym: creating signature - done');

    return toRet;
  }

  static async signDisjointed(params) {
    log.info('Jwt.signDisjointed - start');

    // add the b64 flag
    params.header.b64 = false;

    // sign it
    const signature = await Jwt.sign(params);
    const signatureParts = signature.split('.');

    const disjointedSignature = `${signatureParts[0]}..${signatureParts[2]}`;

    log.debug('Jwt.signDisjointed - returning disjointed signature');
    log.debug(disjointedSignature);
    log.debug('Jwt.signDisjointed -------------------');

    return disjointedSignature;
  }


  static async verify(params) {
    // log the parameters if required
    log.debug('Jwt.verify: params');
    log.debug(params);
    log.debug('Jwt.verify: -----------------------------');

    // validate the params
    log.info('Jwt.verify: validating schema - start');
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(params, jwtVerifySchema);
    if (validationResult.errors.length > 0) {
      log.error('Jwt.verify: validating schema - failed');
      throw new Error(`Jwt.validate - params failed validation. ${validationResult.errors}`);
    }
    log.info('Jwt.verify: validating schema - done');

    log.info(`Jwt.verify: verify using ${params.alg}`);
    let toRet;
    switch (params.alg) {
      case 'none':
      case 'HS256':
        log.info('Jwt.verify: verifying using symmetric alg');
        toRet = Jwt._verifySym(params);
        break;

      default:
        log.info('Jwt.verify: verifying using asymmetric alg');
        toRet = await Jwt._verifyAsym(params);
    }

    log.debug('Jwt.verify: returning');
    log.debug(toRet);
    log.debug('Jwt.verify: -----------------------------');
    return toRet;
  }

  static _verifySym(params) {
    return jws.verify(params.signature, params.alg, params.secret);
  }

  static async _getJwks(params) {
    log.info('Jwt._getJwks - start');
    if (params.jwks !== undefined) {
      log.info('Jwt._getJwks - using jwks specified in parameters');
      return params.jwks;
    }

    if (params.jwksUrl !== undefined) {
      log.info(`Jwt._getJwks - retrieving jwks from ${params.jwksUrl}`);
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line dot-notation
      const httpResponse = await Http.do({ url: params.jwksUrl, parseJson: true });
      if ((httpResponse.status === 200) && (httpResponse.json !== undefined)) {
        return httpResponse.json;
      }
      throw new Error(`Could not retrieve jwks key store: ${httpResponse.body}`);
    }

    throw new Error('Could not locate jwks. Either the jwks or jwksUrl must be specified');
  }

  static async _verifyAsym(params) {
    log.info('Jwt._verifyAsym - start');
    const jwks = await Jwt._getJwks(params);
    const keyStore = await jose.JWK.asKeyStore(jwks);
    log.info('Jwt._verifyAsym - key loaded in key store');

    const options = {};
    if ((params.ignoreCritFields) && (params.headers.crit !== undefined)) {
      options.handlers = {};
      for (let i = 0; i <= params.headers.crit.length; i += 1) {
        options.handlers[params.headers.crit[i]] = true;
      }
    }

    log.debug('Jwt._verifyAsym - created options');
    log.debug(options);
    log.debug('Jwt._verifyAsysm -----------------');

    const verifier = jose.JWS.createVerify(keyStore, options);

    try {
      await verifier.verify(params.signature);
      log.info('Jwt._verifyAsym - verification successful');
      return true;
    } catch (err) {
      log.error(err);
      log.error('Jwt._verifyAsym - verification failed');
      return false;
    }
  }

  static async verifyDisjointed(params) {
    log.info('Jwt.verifyDisjointed - start');

    // reconstitute the signature
    const signedWithNone = await Jwt.sign({
      header: { alg: 'none', b64: true },
      body: params.body
    });

    const signedWithNoneParts = signedWithNone.split('.');
    const signatureParts = params.signature.split('.');
    params.signature = `${signatureParts[0]}.${signedWithNoneParts[1]}.${signatureParts[2]}`;
    log.debug('Jwt.verifyDisjointed - reconstituted signature');
    log.debug(`header: ${signatureParts[0]}`);
    log.debug(`header: ${signedWithNoneParts[1]}`);
    log.debug(`header: ${signatureParts[2]}`);
    log.debug('Jwt.verifyDisjointed ----------------');

    return Jwt.verify(params);
  }

  static decode(signature) {
    const toRet = jws.decode(signature);
    if (toRet === null) {
      throw new Error('signature is not a valid jwt');
    }

    return toRet;
  }
}

module.exports = Jwt;
