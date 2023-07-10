const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    person_id: String,
    feature_matrix: [[Number]],
});

const featureModel = mongoose.model('feature_matrix', featureSchema, 'feature_matrices');

module.exports = featureModel