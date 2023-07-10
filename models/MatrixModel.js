const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matrixSchema = new Schema({
    person_id: String,
    weighted_adjacency_matrix: [[Number]],
    feature_matrix: [[Number]],
    latent_representation: [[Number]],
});

const matrixModel = mongoose.model('matrix', matrixSchema, 'matrices');

module.exports = matrixModel