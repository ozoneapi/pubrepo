const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');

class MongoDriver {
  constructor(connectString) {
    this.connectString = connectString;
  }

  async find(collectionName, filter, projection, sort) {
    return this._find(collectionName, filter, projection, sort);
  }

  async _connect() {
    if (this.client === undefined) {
      this.client = await MongoClient.connect(this.connectString, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  }

  async _find(collectionName, filter, projection, sort) {
    await this._connect();

    // Get the findAndModify collection
    const collection = this.client.db().collection(collectionName);

    // Modify and return the modified document
    MongoDriver._adjustFilter(filter);

    const data = await collection.find(filter, projection).sort(sort).toArray();

    return data;
  }

  static _adjustFilter(filter) {
    if ((filter === undefined) || (filter === null)) {
      return;
    }

    Object.keys(filter).forEach((param) => {
      if (param.endsWith('.id')) {
        const newParamName = `${param.substring(0, param.length - 2)}_id`;
        const newParamValue = new MongoDb.ObjectID(filter[param]);
        filter[newParamName] = newParamValue;
        delete filter[param];
      }
    });

    // adjust the id param if there is one
    if (filter.id) {
      filter._id = MongoDriver.wrapObjectId(filter.id);
      delete filter.id;
    }
  }
}

module.exports = MongoDriver;
