// get schema instance
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create schema
// Create a Mongoose schema and model for persons
// Create a Mongoose schema and model for persons
const similaritySchema = new Schema({
  name: String,
  imagePath: String,
});

const SimilarityModel = mongoose.model('Similarity', similaritySchema, 'similarities');
// export model
module.exports = SimilarityModel