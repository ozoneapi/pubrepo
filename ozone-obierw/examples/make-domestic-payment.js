const Payments311 = require('../src/pisp/payments-311.js');
const config = require('./config/config.json');

async function go() {
  const payments = new Payments311(config);
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

  const domesticPaymentConsentResponse = await payments.postDomesticPaymentsConsent(domesticPaymentConsentRequest);
  return domesticPaymentConsentResponse;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
