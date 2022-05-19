const Jwks = require('../src/jwks.js');
const minimist = require('minimist');
const Ajv = require("ajv").default
const schema = require('./schema.json');
const process = require('process');

function _displayCLIHelp() {
  console.log(`
    Format: node manage-jwks.js [operation] --url [url] --profile [profile]

    Supported operations:
    - get:
      Optional:
      --kid [-k]: Use with get operation to display the specified kid

      Optional:
      -query [-q]: Run a jsonpath query

    - init:

    - add:
      Must specify:
      --size [-s]: key size
      --use: sig | enc
      --out [o]: file to write private key to. Extension can be .pem or .jwk

    Common parameters:
      --url [-u]: An s3 URL
      --profile [-p]: An AWS Profile to use
  `);
}

function _parseArgs() {
  // parse the cli
  const args = minimist(
    process.argv.slice(2),
    {
      alias: {
        u: 'url',
        p: 'profile',
        k: 'kid',
        s: 'size',
        o: 'out'
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

  switch(args._[0]) {
    case 'get':
      if (args.kid === undefined) {
        return Jwks.get(args.url, args.profile);
      } else {
        return Jwks.getKeyByKid(args.url, args.kid, args.profile);
      }

    case 'init':
      return Jwks.init(args.url, args.profile);

    case 'add':
      if (args.size === undefined) {
        throw new Error('--size must be specified with add');
      }

      if (args.use === undefined) {
        throw new Error('--use must be specified with add');
      }

      return Jwks.addKey(args.url, args.size, args.use, args.out, args.profile);


    default:
      throw new Error(`${args._[0]} is an invalid operation`);
  }
}

go()
  .then(out => console.log(JSON.stringify(out, undefined, 2)))
  .catch(err => console.log(err));
