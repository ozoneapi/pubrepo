const OidcClient = require('ozone-oidc-client');

class OidcHelper {
  constructor(config) {
    this.oidcClient = new OidcClient(config.clientConfig);
  }

  async doBcAuthorizeModeC(paymentConsentId, scope, state) {
    // lets construct the "mode c" login_hint_token
    const loginHintJwt = {
      'http://openbanking.org.uk/sit': 'IID',
      'http://openbanking.org.uk/openbanking_intent_id': paymentConsentId
    };

    // lets bc-authorize
    return this.oidcClient.doFapiBcAuthorize(loginHintJwt, scope, state);
  }

  async pollForCibaToken(authReqId, scope, snooze, tryFor) {
    const now = Date.now();
    const stopAt = now + (tryFor * 1000);

    let token;
    while (Date.now() < stopAt) {
      await OidcHelper.sleep(snooze * 1000); //eslint-disable-line no-await-in-loop

      token = await this.oidcClient.getTokenByCibaGrant('payments', authReqId); //eslint-disable-line no-await-in-loop
      console.log(token);

      if (token.error === 'authorization_pending') {
        continue; //eslint-disable-line no-continue
      }

      // in all other cases, return the token
      return token;
    }

    throw new Error('timeout waiting for access token to be approved');
    
  }

  static sleep(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }
}
module.exports = OidcHelper;
