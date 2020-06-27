const Signature31 = require('../src/sigs/signature-31.js');
const config = require('./config/config-tide-sandbox-local.json');

async function go() {
  const sig = new Signature31(config, process.env.OZONE_HOME);

  const consent = {
    "Data": {
      "Initiation": {
        "InstructionIdentification": "SIDP01",
        "EndToEndIdentification": "FRESCO.21302.GFX.20",
        "InstructedAmount": {
          "Amount": "15.00",
          "Currency": "GBP"
        },
        "CreditorAccount": {
          "SchemeName": "SortCodeAccountNumber",
          "Identification": "20000319470104",
          "Name": "Messers Simplex & Co"
        },
        "RemittanceInformation": {
          "Reference": "Hellodarkness"
        }
      }
    },
    "Risk": {}
  };

  const string = JSON.stringify(consent, undefined, '\t');
  const buf = Buffer.from(string, 'utf8');
  for (const b of buf) {
    console.log(b + String.fromCharCode(b));
  }

  console.log(string);
  return sig.sign(string, 'json');
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
