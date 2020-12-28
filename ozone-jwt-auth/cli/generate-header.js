const JwtAuth = require('../src/jwt-auth.js');

const minimist = require('minimist');
const Ajv = require("ajv").default
const schema = require('./schema.json');
const process = require('process');

const fs = require('fs');

function _displayCLIHelp() {
  console.log(`
    Format: node generate-header.js --in [file.pem]

    --in: private key file in PEM format
    --sub: e.g. 0015800001041RHAA
    --iss: e.g. 'OpenBanking'
  `);
}

function _parseArgs() {
  // parse the cli  
  const args = minimist(
    process.argv.slice(2), 
    { 
      alias: {
      } 
    }
  );

  // validate the cli
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(args);
  if (!valid) {
    _displayCLIHelp();
    process.exit(-1);
  }

  return args;
}

async function go() {
  const args = _parseArgs();

  // read the key file
  const jwkString = fs.readFileSync(args.in, 'utf8');

  // parse the jwk
  const privateKey = JSON.parse(jwkString);

  const signingParams = {
    alg: 'PS256',
    iss: args.iss,
    sub: args.sub,
    aud: 'aud',
    validity: 10,
    privateKey
  };

  return JwtAuth.getJws(signingParams);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
