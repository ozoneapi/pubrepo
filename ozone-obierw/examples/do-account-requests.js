const Ais31 = require('../src/aisp/ais-31.js');
const config = require('./config/config-ob19.json');
const OidcHelper = require('../src/oidc/oidc-helper.js');

async function go() {
  const ais = new Ais31(config, process.env.OZONE_HOME);

  const consent = {
    Data: {
      Permissions: [
        'ReadAccountsBasic',
        'ReadAccountsDetail'
      ]
    },
    Risk: {}
  };

  const c = await ais.createConsent(consent);

  const oidcHelper = new OidcHelper(config, process.env.OZONE_HOME);
  const x = await oidcHelper.doHeadlessAuth('openid accounts', 'https://ob19-auth1-ui.o3bank.co.uk/simple-redirect-url', 'code', c.Data.ConsentId);
  return x;

}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
