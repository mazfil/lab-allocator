// server/index.js
const Model = require("./models/model");
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();

const DATABASE_URL = "mongodb://localhost:27017/laballocator";

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;


db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log("Connected to Database :-)");
})

app.get("/api/data/:collection?", async(req, res) => {
/*    const collection = req.params.collection;


    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { address: "Park Lane 38" };
      dbo.collection("customers").find(query).toArray(function(err, result) {
      if (err) throw err;
        console.log(result);
        db.close();
      });i
    });
*/
  const collection = req.params.collection;

  try{
    const data = await Model.find();
    console.log(data);
    res.json(data);
  }catch(error){
    res.status(500).json({message: error.message});
  }

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});