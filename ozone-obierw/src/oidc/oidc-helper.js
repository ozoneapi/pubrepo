const OidcClient = require('ozone-oidc-client');
const Http = require('ozone-http-client');
const _ = require('lodash');

class OidcHelper {
  constructor(config, baseFolder) {
    this.oidcClient = new OidcClient(config.clientConfig, baseFolder);
    this.baseFolder = baseFolder;
    this.config = config;
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

  async doHeadlessAuth(scope, redirectUri, responseType, intentId) {
    const redirectUrl = await this.getAuthorizationCodeUrl(scope, redirectUri, responseType, intentId);

    const code = await this.getHeadlessAuthorizationCode(redirectUrl, responseType);

    const token = await this.oidcClient.getTokenByAuthCodeGrant(scope, redirectUri, code);
    return token;
  }

  async getHeadlessAuthorizationCode(redirectUrl, responseType) {
    const httpParams = {
      verb: 'get',
      url: redirectUrl,
      certs: this.config.clientConfig.certs,
      maxRedirects: 0
    };

    // make the call
    const res = await Http.do(httpParams, this.baseFolder);
    const responseUrl = _.get(res, 'headers.location');
    if (responseUrl === undefined) {
      throw new Error(`Failed to do headless auth: ${res.body}`);
    }

    const url = new URL(responseUrl);

    let params;
    switch (responseType) {
      case 'code':
        params = url.search;
        break;

      case 'code id_token':
        params = url.hash.substring(1);
        break;

      default:
        throw new Error(`Unsupported response type ${responseType}`);
    }

    const searchParams = new URLSearchParams(params);

    if (searchParams.get('error')) {
      throw new Error(`Failed to do headless auth: ${searchParams.get('error')} ${searchParams.get('error_description')}`);
    }

    return searchParams.get('code');
  }

  async getAuthorizationCodeUrl(scope, redirectUri, responseType, intentId) {
    return this.oidcClient.getAuthorizationCodeUrl(
      scope, 
      redirectUri,
      responseType, 
      {
        id_token: {
          openbanking_intent_id: {
            value: intentId,
            essential: true
          }
        }
      },
      true
    );
  }

  static sleep(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }
}
module.exports = OidcHelper;
