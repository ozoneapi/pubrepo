const Jwt = require('ozone-jwt');
const Validator = require('jsonschema').Validator;
const schema = require('../obie-config-schema.json');

class Signature31 {
  constructor(config, baseFolder) {
    // validate the config
    const jsonSchemaValidator = new Validator();
    const validationResult = jsonSchemaValidator.validate(config, schema);
    if (validationResult.errors.length > 0) {
      throw new Error(`obie config failed validation. ${validationResult.errors}`);
    }

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
        'http://openbanking.org.uk/iat': 1000,
        'http://openbanking.org.uk/iss': this.config.messageSigning.iss,
        'http://openbanking.org.uk/tan': this.config.messageSigning.tan,
        crit: [
          'http://openbanking.org.uk/iat',
          'http://openbanking.org.uk/iss',
          'http://openbanking.org.uk/tan'
        ]
      },
      body,
      signingKeyFileName: this.config.clientConfig.signingKeyFileName
    };

    return Jwt.signDetached(params, this.baseFolder);
  }
}
module.exports = Signature31;
