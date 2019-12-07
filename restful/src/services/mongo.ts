const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

export const MongoService = {
  connect: () => MongoClient.connect(url, function(err: Error, db: any) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function(err: Error, res: any) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
    });
  }),
}
