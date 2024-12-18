// server/index.js
const {authenticator} = require('otplib');
const { createHash } = require('crypto');

const Course = require("./models/CourseModel");
const Timetable = require("./models/TimetableModel");
const Log = require("./models/LogModel");
const OTP = require("./models/OtpModel");
const Token = require("./models/TokenModel");

const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json())


const DATABASE_URL = "mongodb://localhost:27017/laballocator";

console.log("Attempting to connect to the database...")
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;


db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log("Connected to Database :-)");
})

/**
 * Returns all logs from the database
 */
app.get("/api/logs", async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(await Log.find());
});

/**
 * Adds a log to the database
 */
app.post("/api/logs", async(req, res) => {
  const body = req.body;
  try{
    await Log.create(body);
    res.status(201)
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

app.get("/api/login", async(req, res) => {
  const password = req.query.password;
  if(authenticator.check(password, await OTP.find({}).otp)){
    console.log(password)
    console.log("OTP VALID")
    const newToken = createHash('sha256').update((Math.random() * Number.MAX_SAFE_INTEGER).toString()).digest('hex');
    console.log("Token: ", token)
    res.setHeader('Content-Type', 'application/json');
    
    res.json({});
  }

});

/**
 * Get Request - Returns the data from a specified collection, and a specific course or timetable if specified.
 */
app.get("/api/data", async(req, res) => {
  const token = req.quert.token;
  try{
    if (await Token.find({token: token})){
      const collection = req.query.collection;
      const target = req.query.target;
      var data;

      if(collection == "course_data"){
        data = await target ? await Course.find({course_code: target}) : await Course.find()
      }else if (collection == "timetable_data"){
        if (target == "list"){
          data = await Timetable.find({}).select('_id')
        }else{
          data = await target ? await Timetable.findById(target) : await Timetable.findOne().sort({'_id': -1})
        }
      }else{
        throw new Error ("No collection specified.");
      }
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    }
    
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
  const body = req.body;

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
    const body = req.body;
    const target = req.query.target;

    try{
        if(collection === "timetable_data"){
            await Timetable.findOneAndUpdate({_id: target}, body);
        }else if (collection === "course_data"){
            await Course.findOneAndUpdate({course_code: target}, body);
        }else{
            throw new Error("No Collection specified");
        }
        res.status(204)
      }catch(error){
        res.status(400).json({message: error.message});
      }
});

/**
 * Post Delete - Deletes a specified datapoint.
 */
app.post("/api/delete", async(req, res) => {
    const collection = req.query.collection;
    const target = req.query.target;
    try{
        if(collection === "timetable_data"){
            await Timetable.delete({_id: target})
        }else if (collection === "course_data"){
          if(target === "ALL"){
            await Course.deleteMany({});
          }else{
            await Course.deleteOne({_id: target})
          }
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
