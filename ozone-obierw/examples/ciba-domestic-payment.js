const Payments311 = require('../src/pisp/payments-311.js');
const OidcHelper = require('../src/oidc/oidc-helper.js');
const config = require('./config/config.json');

async function go() {
  const payments = new Payments311(config);

  const domesticPaymentConsentResponse = await payments.postSimpleDomesticPaymentsConsent(
    'Happy birthday',
    '20.00',
    '20000319470104',
    'Scott Tiger'
  );

  if (domesticPaymentConsentResponse.Data === undefined) {
    throw new Error(domesticPaymentConsentResponse);
  }

  const paymentConsentId = domesticPaymentConsentResponse.Data.ConsentId;

  // bc-authorize it
  const oidcHelper = new OidcHelper(config);
  const authReq = await oidcHelper.doBcAuthorizeModeC(paymentConsentId, 'payments', 'nothing');

  // get the token
  console.log('Created bc_authorize');
  console.log(`Authorise consent with consent id ${paymentConsentId} and auth_req_id ${authReq.auth_req_id}`);
  console.log(`or scan the barcode at https://api.qrserver.com/v1/create-qr-code/?data=${paymentConsentId}:${authReq.auth_req_id}`)
  return oidcHelper.pollForCibaToken(authReq.auth_req_id, 'payments', 5, 60);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
