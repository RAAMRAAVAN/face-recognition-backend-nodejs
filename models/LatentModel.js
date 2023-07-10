const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const latentSchema = new Schema({
    person_id: String,
    latent_representation: [[Number]],
});

const latentModel = mongoose.model('latent_matrix', latentSchema, 'latent_matrices');

module.exports = latentModel