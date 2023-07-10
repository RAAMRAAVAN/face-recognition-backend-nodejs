const express = require('express');
const router = express.Router();
const personsController = require('../controllers/personsController')
const similarityController = require('../controllers/similarityController')
const matricesController = require('../controllers/matrixController')

router.get('/get_all_persons', personsController.getPersons)
router.post('/upload', personsController.uploadImage, personsController.createPerson);
router.post('/uploadSimilarity', similarityController.uploadImage, similarityController.createPerson);
router.get("/api/similarity/:id", similarityController.getPersonImage)
router.post("/get_similarities", similarityController.getsimilarity)
router.get("/api/person/:id", personsController.getPersonImage)
router.get("/api/query/:id", similarityController.getQueryImage)
router.get("/api/person_name/:id", personsController.getPersonName)
router.post("/api/upload_adj_matrix",matricesController.uploadAdjMatrix)
router.post("/api/upload_feature_matrix", matricesController.uploadFeatureMatrix)
router.post("/api/upload_latent_matrix", matricesController.uploadLatentMatrix)
router.post("/download_matrix", matricesController.downloadMatrix)
module.exports = router;