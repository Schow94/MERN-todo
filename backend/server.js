const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;

// Main Express app
const app = express();
app.use(cors());

// Mini express app for dif routes to have their own miniapp
const router = express.Router();

const dbRoute =
  'mongodb+srv://admin:admin@cluster0-qz68n.mongodb.net/test?retryWrites=true&w=majority';
// Default to connect to db
mongoose.connect(dbRoute, { useNewUrlParser: true });

//Once mongodb connection is open, print to console to tell us
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));

//checks if connection with db is successful
db.on('error', console.error.bind(console, 'MongodB connection error'));

//bodyParser parses the request body to be readable json format
app.use(bodyParser.urlencoded({ extend: false }));
//when false - obj will caontain key:value pairs where value can be:
// string or array
//when true - Can be any type

app.use(bodyParser.json());

//optional - for logging
app.use(logger('dev'));

//DB - CRUD Methods

// GET - fetches all data from db
router.get('/getData', (req, res) => {
  //Mongo method to find params
  Data.find((err, data) => {
    if (err) {
      //res,json() calls res.send() at the end
      //res.json() converts non-objs to json
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, data: data });
  });
});

// CREATE - Adds data to db
router.post('/putData', (req, res) => {
  let data = new Data();
  const { id, task } = req.body;

  if ((!id && id !== 0) || !task) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }

  data.task = task;
  data.id = id;

  data.save(err => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true });
  });
});

// DELETE - Removes data from db
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;

  Data.findByIdAndRemove(id, err => {
    if (err) {
      return res.send(err);
    }
    return res.json({ success: true });
  });
});

// EDIT - Overwrites existing data in db
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;

  Data.findByIdAndUpdate(id, update, err => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true });
  });
});

// APPEND API for our http requests
app.use('/api', router);

// Launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
