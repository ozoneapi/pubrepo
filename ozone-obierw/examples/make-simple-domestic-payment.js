const Payments311 = require('../src/pisp/payments-311.js');
const config = require('./config/config.json');

async function go() {
  const payments = new Payments311(config);

  const domesticPaymentConsentResponse = await payments.postSimpleDomesticPaymentsConsent(
    'Happy birthday',
    '20.00',
    '20000319470104',
    'Scott Tiger'
  );

  return domesticPaymentConsentResponse;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
