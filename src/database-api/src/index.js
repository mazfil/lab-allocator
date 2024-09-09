// server/index.js
const Course = require("./models/CourseModel");
const Timetable = require("./models/TimetableModel");

const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json())


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
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  }catch(error){
    res.status(500).json({message: error.message});
  }
});


// Post request for updating or uploading data
app.post("/api/upload", async(req, res) => {
  const collection = req.query.collection;
  const target = req.query.target;
  const body = JSON.stringify(req.body);
  const update = Boolean(req.query.update);


  try{
    switch(collection){
      case "timetable_data":
        await Timetable.create(req.body)
        break;
      case "course_data":
        console.log("Uploading Course");
        if(update){
          console.log("Updating Course");
          await Course.findOneAndUpdate({course_code: body.course_code});
        }else{
          console.log("Creating new Course");
          await Course.create(body)
        }
        break;
    }
  }catch(error){
    res.status(500).json({message: error.message});
  }

});

app.post("/api/update", async(req, res) => {});
app.post("/api/delete", async(req, res) => {});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
