// server/index.js
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

app.get("/api/data/:collection?", (req, res) => {
    const collection = req.params.collection;

    var db = client.db("laballocator")
    res.json(db.collection("course_data").find({}));
/*
    switch (collection){
      case "course-data":
        res.json({ message: "Course Data"});
        break;
      case "timetable-data":
        res.json({ message: "Timetable Data"});
        break;
      default:
        res.json({ message: "No Collection Specified."});
    }*/
  });


app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});

