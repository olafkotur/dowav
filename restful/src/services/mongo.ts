const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

let database: any = null;

export const MongoService = {
  connect: () => new Promise((resolve: any) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async (error: Error, db: any) => {
      if (error) {
        throw error;
      }
      database = db.db('data')
      console.log(`MongoService: Succesfully connected to database`)
      resolve(true);
    });
  }),

  insertOne: async (collection: string, data: any) => {
    await database.collection(collection).insertOne(data, (error: Error) => {
    if (error) {
      throw error;
    }
    });
  },

  insertMany: async (collection: string, data: any) => {
    await database.collection(collection).insertMany(data, (error: Error) => {
    if (error) {
      throw error;
    }
    });
  },

  findOne: async (collection: string, query: any) => {
    return new Promise((resolve: any) => {
      database.collection(collection).findOne(query, (error: Error, res: any) => {
        if (error) {
          throw error;
        }
        resolve(res);
      });
    });
  },

  findMany: async (collection: string, query: any) => {
    return new Promise((resolve: any) => {
      database.collection(collection).find(query, (error: Error, res: any) => {
        if (error) {
          throw error;
        }
        resolve(res.toArray());
      });
    });
  },

  deleteOne: async (collection: string, query: any) => {
    return new Promise((resolve: any) => {
      database.collection(collection).deleteOne(query, (error: Error, res: any) => {
        if (error) {
          throw error;
        }
        resolve(res);
      });
    });
  },

  deleteMany: async (collection: string, query: any) => {
    return new Promise((resolve: any) => {
      database.collection(collection).deleteMany(query, (error: Error, res: any) => {
        if (error) {
          throw error;
        }
        resolve(res);
      });
    });
  },
}