const matrixModel = require("../models/MatrixModel");
const adjModel = require("../models/AdjModel")
const latentModel = require("../models/LatentModel")
const featureModel = require("../models/FeatureModel")
const Person = require("../models/PersonModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadLatentMatrix = async (req, res) => {
  try {
    let person_id = req.body.person_id;
    const person = await Person.findOne({ _id: person_id });

    if (!person) {
      return res.status(404).json({ status: false, message: "Person not found" });
    }
    
    // console.log("found", person)
    let latentMatrix = await latentModel.findOne({person_id: req.body.person_id});
    let latentFound = false;
    if(latentMatrix){
      latentFound = true
      latentMatrix.latent_representation = req.body.latent_representation;
    } else {
      latentFound = false;
      latentMatrix = new latentModel({
        person_id: req.body.person_id,
        latent_representation: req.body.latent_representation,
      })
    }

    latentMatrix.save()
      .then((savedMatrices) => {
        let result = {
          person_id: savedMatrices.person_id,
          latent_representation: savedMatrices.latent_representation.toObject(),
        };
        res.json({
          result: result,
          status: true,
          message: latentFound ? "Matrices updated successfully" : "Matrices saved successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving matrices");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving matrices");
  }
};

exports.uploadAdjMatrix = async (req, res) => {
  try {
    let person_id = req.body.person_id;
    const person = await Person.findOne({ _id: person_id });

    if (!person) {
      return res.status(404).json({ status: false, message: "Person not found" });
    }
    
    // console.log("found", person)
    let adjMatrix = await adjModel.findOne({person_id: req.body.person_id});
    let adjFound = false;
    if(adjMatrix){
      adjFound = true
      adjMatrix.weighted_adjacency_matrix = req.body.weighted_adjacency_matrix;
    } else {
      adjFound = false;
      adjMatrix = new adjModel({
        person_id: req.body.person_id,
        weighted_adjacency_matrix: req.body.weighted_adjacency_matrix,
      })
    }

    adjMatrix.save()
      .then((savedMatrices) => {
        let result = {
          person_id: savedMatrices.person_id,
          weighted_adjacency_matrix: savedMatrices.weighted_adjacency_matrix.toObject(),
        };
        res.json({
          result: result,
          status: true,
          message: adjFound ? "Adj Matrices updated successfully" : "Adj Matrices saved successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving matrices");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving matrices");
  }
};

exports.uploadFeatureMatrix = async (req, res) => {
  try {
    let person_id = req.body.person_id;
    const person = await Person.findOne({ _id: person_id });

    if (!person) {
      return res.status(404).json({ status: false, message: "Person not found" });
    }
    
    // console.log("found", person)
    let featureMatrix = await featureModel.findOne({person_id: req.body.person_id});
    let featureFound = false;
    if(featureMatrix){
      featureFound = true
      featureMatrix.feature_matrix = req.body.feature_matrix;
    } else {
      featureFound = false;
      featureMatrix = new featureModel({
        person_id: req.body.person_id,
        feature_matrix: req.body.feature_matrix,
      })
    }

    featureMatrix.save()
      .then((savedMatrices) => {
        let result = {
          person_id: savedMatrices.person_id,
          feature_matrix: savedMatrices.feature_matrix.toObject(),
        };
        res.json({
          result: result,
          status: true,
          message: featureFound ? "feature Matrix updated successfully" : "feature Matrix saved successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving matrices");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving matrices");
  }
};
exports.downloadMatrix = async (req, res) => {
  const person_id = req.body.person_id;
  const value = req.body.value;
  console.log(person_id, value)
  // Set the response headers for downloading the CSV file
  res.attachment(`${person_id}.csv`);
  res.setHeader('Content-Type', 'text/csv');
  let result=[]
  switch(value){
    case "weighted_adjacency_matrix": 
      result = await adjModel.findOne({ person_id: person_id }).select(value);
    break;
    case "feature_matrix":
      result = await featureModel.findOne({ person_id: person_id }).select(value);
      break;
    case "latent_representation":
      result = await latentModel.findOne({ person_id: person_id }).select(value);
      break;
    default: 
  }
  // const result = await latentModel.findOne({ person_id: person_id }).select(value);

  // res.status(200).send(result[value]);
  // Create a write stream to the response
  const stream = res;

  // Write the Matrix response to the .csv file
  result[value].forEach(row => {
    stream.write(row.join(',') + '\n');
  });

  // End the response
  stream.end();
}
