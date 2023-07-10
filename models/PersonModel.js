// get schema instance
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create schema
// Create a Mongoose schema and model for persons
// Create a Mongoose schema and model for persons
const personSchema = new Schema({
  name: String,
  imagePath: String,
});

const Person = mongoose.model('Person', personSchema);
// export model
module.exports = Person