const Payments311 = require('../src/pisp/payments-311.js');
const OidcHelper = require('../src/oidc/oidc-helper.js');
const config = require('./config/config-ob19.json');
const open = require('open');

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
  console.log('Authorization Request created');

  // get the token
  console.log('Created bc_authorize');
  await open(`https://api.qrserver.com/v1/create-qr-code/?data=${paymentConsentId}:${authReq.auth_req_id}`);
  console.log(`Authorise consent with consent id ${paymentConsentId} and auth_req_id ${authReq.auth_req_id}`);
  console.log(`or scan the barcode at https://api.qrserver.com/v1/create-qr-code/?data=${paymentConsentId}:${authReq.auth_req_id}`)
  const tokenResponse = await oidcHelper.pollForCibaToken(authReq.auth_req_id, 'payments', 5, 120);

  if (tokenResponse.error !== undefined) {
    console.log(`Failed. ${tokenResponse.error}`);
    console.log(`Failed. ${tokenResponse.errorMessage}`);
  }

  if (tokenResponse.access_token === undefined) {
    console.log('Generic error. Could not get access_token');
    return;
  }

  const domesticPaymentResponse = await payments.postSimpleDomesticPayment(tokenResponse, domesticPaymentConsentResponse);
  console.log('Payment completed with id');
}

go()
  .then(out => console.log('Exiting POS Emulator'))
  .catch(err => console.log(err));
