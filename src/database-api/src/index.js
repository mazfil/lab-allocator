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


/**
 * Get Request - Returns the data from a specified collection, and a specific course or timetable if specified.
 */
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
    res.status(400).json({message: error.message});
  }
});


/**
 * Post Upload - Uploads data to the database
 */
app.post("/api/upload", async(req, res) => {
  const collection = req.query.collection;
  const bulk = (req.query.collection ? true : false);
  const body = JSON.stringify(req.body);

  try{
    if(collection === "timetable_data"){
        await Timetable.create(body);
    }else if (collection === "course_data"){
        if (bulk){
            Course.insertMany(body);
        }else{
            Course.create(body);
        }
    }else{
        throw new Error("No Collection specified");
    }
    res.status(201)
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

/**
 * Post Update - Updates existing data in the database, a target/identifier of the specific data needs to be provided
 * to update as this function updates EXISTING data.
 */
app.post("/api/update", async(req, res) => {
    const collection = req.query.collection;
    const body = JSON.stringify(req.body);
    const target = req.query.target;

    try{
        if(collection === "timetable_data"){
            await Timetable.findOneAndUpdate({_id: target}, body);
        }else if (collection === "course_data"){
            await Course.findOneAndUpdate({_id: target}, body);
        }else{
            throw new Error("No Collection specified");
        }
        res.status(204)
      }catch(error){
        res.status(400).json({message: error.message});
      }
});

/**
 * Post Delete - Deletes a specified datapoint. A target must be specified for safefy.
 */
app.post("/api/delete", async(req, res) => {
    const collection = req.query.collection;
    const target = req.query.target;
    try{
        if(collection === "timetable_data"){
            Timetable.delete({_id: target})
        }else if (collection === "course_data"){
            Course.delete({_id: target})
        }else{
            throw new Error("");
        }
        res.status(200)
    }catch(error){
        res.status(400).json({message: error.message});
    }
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});