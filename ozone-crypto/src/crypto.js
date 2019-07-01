const jose = require('node-jose');
const log = require('loglevel').getLogger('ozone-crypto');

class Crypto {
  static async generateRSAKeyPair(keySize, use) {
    log.info(`Crypto.generateRSAKeyPair: generating a key pair of ${keySize} bits - start`);

    if ((use !== 'enc') && (use !== 'sig')) {
      throw new Error(`Parameter use has an invalid value ${use}. Must be 'sig' or 'enc'`);
    }

    // all good, lets go
    const keystore = jose.JWK.createKeyStore();

    const props = {
      use
    };

    const key = await keystore.generate('RSA', keySize, props);

    return {
      publicKey: key.toJSON(),
      privateKey: key.toJSON(true)
    };
  }
}

module.exports = Crypto;
