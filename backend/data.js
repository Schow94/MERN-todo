const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//DB Structure
const DataSchema = new Schema(
  {
    id: String,
    task: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Data', DataSchema);
