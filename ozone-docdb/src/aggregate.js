const { MongoClient } = require('mongodb');

class Aggregate {
  constructor(connectString, collection) {
    this.connectString = connectString;
    this.collection = collection;
  }

  static async getInput() {
    return new Promise(((resolve, reject) => {
      const { stdin } = process;
      let data = '';
  
      stdin.setEncoding('utf8');
      stdin.on('data', (chunk) => {
        data += chunk;
      });
  
      stdin.on('end', () => {
        resolve(data);
      });
  
      stdin.on('error', reject);
    }));
  }

  async initMongo() {
    // init mongo
    const client = await MongoClient.connect(this.connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = client.db();    
  }

  async go() {
    const aggregation = await Aggregate.getInput();

    await this.initMongo();

    const aggregationQuery = [
      {
        $match: {
          a: 10
        }
      }
    ];
    const out = await this.db.collection(this.collection).aggregate(JSON.parse(aggregation)).toArray();

    console.log(aggregation);
    console.log(this.connectString);
    console.log(this.collection);
    console.log(out);
  }
}

async function go() {
  if (process.argv.length !== 4) {
    throw new Error('2 params - cnnect string and collection ');
  }
  const aggregate = new Aggregate(process.argv[2], process.argv[3]);
  return aggregate.go();
}

go()
  .then(() => console.log('script complete'))
  .catch((err) => {
    console.log('script failed');
    console.log(err);
    process.exit(-1);
  });

