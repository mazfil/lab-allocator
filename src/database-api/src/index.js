// server/index.js
const Course = require("./models/CourseModel");
const Timetable = require("./models/TimetableModel");

const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const DATABASE_URL = "mongodb://localhost:27017/laballocator";

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;


db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log("Connected to Database :-)");
})

app.get("/api/data", async(req, res) => {
  const collection = req.query.collection;
  const target = req.query.target;
  var data;

  try{
    if(collection == "course_data"){
      data = await target ? await Course.find({course_code: target}) : await Course.find()
    }else if (collection == "timetable_data"){
      data = await target ? await Timetable.find({created: target}) : await Timetable.findOne().sort({created: -1})
    }else{
      throw new Error ("No collection specified.");
    }
    console.log("/api/data?collection=" + collection + "&target=" + target + "/");
    console.log(data[0]);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  }catch(error){
    res.status(500).json({message: error.message});
  }

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});