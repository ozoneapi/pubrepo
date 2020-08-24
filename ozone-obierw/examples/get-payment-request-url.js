const OidcHelper = require('../src/oidc/oidc-helper.js');
const Payments311 = require('../src/pisp/payments-311.js');
const config = require('./config/config-cip-e2e.json');

async function go() {
  const payments = new Payments311(config, process.env.OZONE_HOME);
  const domesticPaymentConsentRequest = {
    Data: {
      Initiation: {
        InstructionIdentification: 'SIDP01',
        EndToEndIdentification: 'FRESCO.21302.GFX.20',
        InstructedAmount: {
          Amount: '15.00',
          Currency: 'GBP'
        },
        CreditorAccount: {
          SchemeName: 'SortCodeAccountNumber',
          Identification: '20000319470104',
          Name: 'Messers Simplex & Co'
        }
      }
    },
    'Risk': {}
  };

  const c = await payments.postDomesticPaymentsConsent(domesticPaymentConsentRequest);

  const oidcHelper = new OidcHelper(config, process.env.OZONE_HOME);
  const x = await oidcHelper.getAuthorizationCodeUrl('openid payments', 'https://auth1.cip-sandbox.ozoneapi.co.uk/simple-redirect-url', 'code', c.Data.ConsentId);
  return x;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
