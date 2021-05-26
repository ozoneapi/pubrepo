const Jwt = require('ozone-jwt');
const schema = require('../obie-config-schema.json');

class Signature31 {
  constructor(config, baseFolder) {

    // do a lighter validation
    // TODO

    this.config = config;
    this.baseFolder = baseFolder;
  }

  async sign(body, contentType) {
    const params = {
      header: {
        alg: this.config.messageSigning.alg,
        typ: 'JOSE',
        cty: contentType,
        kid: this.config.clientConfig.signingKeyKid,
        'http://openbanking.org.uk/iat': Math.floor(Date.now() / 1000),
        'http://openbanking.org.uk/iss': this.config.messageSigning.iss,
        'http://openbanking.org.uk/tan': this.config.messageSigning.tan,
        crit: [
          'http://openbanking.org.uk/iat',
          'http://openbanking.org.uk/iss',
          'http://openbanking.org.uk/tan'
        ]
      },
      body
    };

    if (this.config.clientConfig.signingKeyFileName) {
      params.signingKeyFileName = this.config.clientConfig.signingKeyFileName;
    } else {
      params.signingKeyPEM = this.config.clientConfig.signingKeyPEM;
    }

    return Jwt.signDetached(params, this.baseFolder);
  }
}
module.exports = Signature31;
