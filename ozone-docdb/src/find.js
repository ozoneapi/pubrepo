const minimist = require('minimist');
const MongoDriver = require('./mongo-driver.js');

function loadCmdLine() {
  const toRet = minimist(process.argv.slice(2));

  if ((toRet._.length === 0) || (toRet.h) || (toRet.help)) {
    console.log(`
      node find.js --url <mongourl> <collection> <filter>

        mongourl   ..... optional connect string. Uses MONGO_URL environment variable if not specified.
        collection ..... collection. optionally in <database>.<collection> format
        filter     ..... filter to apply
      `);

    process.exit(-1);
  }

  return toRet;
}

async function go() {
  const params = loadCmdLine();

  // connect to mongo
  let url = (params.url) || (process.env.MONGO_URL);
  if (url === undefined) {
    throw new Error('connection url not specified');
  }


  // get the collection name
  let collectionName = params._[0];
  if (collectionName.indexOf('.') !== -1) {
    const name = collectionName.split('.');
    collectionName = name[1];
    url = url.substring(0, url.lastIndexOf('/'));
    url = `${url}/${name[0]}`;
  }

  const filter = JSON.parse(params._[1] || '{}');

  // query it
  const driver = new MongoDriver(url);
  const result = await driver.find(collectionName, filter);
  console.log(JSON.stringify(result, undefined,2));
}


go()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
