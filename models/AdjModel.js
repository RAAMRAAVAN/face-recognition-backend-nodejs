const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adjSchema = new Schema({
    person_id: String,
    weighted_adjacency_matrix: [[Number]],
});

const adjModel = mongoose.model('weighted_adjacency_matrix', adjSchema, 'weighted_adjacency_matrices');

module.exports = adjModel