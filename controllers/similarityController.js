const matrixModel = require("../models/MatrixModel")
const latentModel = require("../models/LatentModel")
const Person = require("../models/PersonModel")
const SimilarityModel = require("../models/SimilarityModel")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
function calculateCosineSimilarity(matrixA, matrixB) {
    // Flatten the matrices to arrays
    const arrayA = matrixA.flat();
    const arrayB = matrixB.flat();
  
    // Calculate the dot product
    const dotProduct = arrayA.reduce((sum, value, index) => sum + value * arrayB[index], 0);
  
    // Calculate the Euclidean norms
    const normA = Math.sqrt(arrayA.reduce((sum, value) => sum + value ** 2, 0));
    const normB = Math.sqrt(arrayB.reduce((sum, value) => sum + value ** 2, 0));
  
    // Calculate the similarity
    const similarity = dotProduct / (normA * normB);
  
    return similarity;
  }
  
  function calculateCorrelation(matrixA, matrixB) {
    // Flatten the matrices to arrays
    const arrayA = matrixA.flat();
    const arrayB = matrixB.flat();
  
    // Calculate the means
    const meanA = arrayA.reduce((sum, value) => sum + value, 0) / arrayA.length;
    const meanB = arrayB.reduce((sum, value) => sum + value, 0) / arrayB.length;
  
    // Calculate the covariance
    const covariance = arrayA.reduce((sum, value, index) => sum + (value - meanA) * (arrayB[index] - meanB), 0) / arrayA.length;
  
    // Calculate the standard deviations
    const stdA = Math.sqrt(arrayA.reduce((sum, value) => sum + (value - meanA) ** 2, 0) / arrayA.length);
    const stdB = Math.sqrt(arrayB.reduce((sum, value) => sum + (value - meanB) ** 2, 0) / arrayB.length);
  
    // Calculate the correlation coefficient
    const correlation = covariance / (stdA * stdB);
  
    return correlation;
  }
  
  function calculateEuclideanDistance(matrixA, matrixB) {
    // Flatten the matrices to arrays
    const arrayA = matrixA.flat();
    const arrayB = matrixB.flat();
  
    // Calculate the squared differences
    const squaredDifferences = arrayA.map((value, index) => (value - arrayB[index]) ** 2);
  
    // Sum the squared differences
    const sumOfSquaredDifferences = squaredDifferences.reduce((sum, value) => sum + value, 0);
  
    // Calculate the Euclidean distance
    const distance = Math.sqrt(sumOfSquaredDifferences);
  
    return 1-distance;
  }
  
  function calculatePearsonSimilarity(matrixA, matrixB) {
    // Flatten the matrices to arrays
    const arrayA = matrixA.flat();
    const arrayB = matrixB.flat();
  
    // Calculate the means
    const meanA = arrayA.reduce((sum, value) => sum + value, 0) / arrayA.length;
    const meanB = arrayB.reduce((sum, value) => sum + value, 0) / arrayB.length;
  
    // Calculate the numerator and denominators
    let numerator = 0;
    let denominatorA = 0;
    let denominatorB = 0;
  
    for (let i = 0; i < arrayA.length; i++) {
      const deviationA = arrayA[i] - meanA;
      const deviationB = arrayB[i] - meanB;
  
      numerator += deviationA * deviationB;
      denominatorA += deviationA ** 2;
      denominatorB += deviationB ** 2;
    }
  
    // Calculate the Pearson correlation coefficient
    const similarity = numerator / (Math.sqrt(denominatorA) * Math.sqrt(denominatorB));
  
    return similarity;
  }
exports.getsimilarity = async (request, response) => {
    // const collection = db.collection('your-collection-name');
    const test_latent=request.body.test_latent;
    // console.log("latent=",test_latent)
    const result = await latentModel.find();
    let temp;
    let data=[];
    // test_latent=(result[0].laten t_representation)
    // console.log(result)
    result.map((value)=>{
        PearsonSimilarity = calculatePearsonSimilarity(value.latent_representation, test_latent)
        CosineSimilarity = calculateCosineSimilarity(value.latent_representation, test_latent)
        Correlation = calculateCorrelation(value.latent_representation, test_latent)
        EuclideanDistance = calculateEuclideanDistance(value.latent_representation, test_latent)
        temp={"id": value.person_id, "PearsonSimilarity":PearsonSimilarity, "CosineSimilarity": CosineSimilarity, "Correlation": Correlation, "EuclideanDistance": EuclideanDistance}
        data.push(temp)
        // console.log(value.latent_representation)
    })
    data.sort((a, b) => b.CosineSimilarity - a.CosineSimilarity);
    // console.log(typeof(data), data)
    response.status(200).send(data);
}

// Controller function for handling image upload
exports.uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send('Error uploading image.');
    }
    next();
  });
};

exports.getQueryImage = (req, res) => {
  SimilarityModel.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).send('Person not found.');
      }

      if (!person.imagePath) {
        return res.status(404).send('Image not found.');
      }
      res.set('Content-Type', 'image/jpeg');
      file = path.join(__dirname, person.imagePath)
      file = file.replace('\\controllers', '')
      console.log(file, typeof(file))
      res.sendFile(file);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving the person from the database.');
    });
}

exports.createPerson = (req, res) => {
  // Save the image path or unique name to the database
  let id = req.body.id;
  // console.log("id=",id)
  if(id === undefined){
    const person = new SimilarityModel({
      name: req.body.name,
      imagePath: req.file.path, // Assuming the file path is stored in the 'path' property
    });
  
    person.save()
      .then((savedPerson) => {
        res.json({ id: savedPerson._id, status: true, message: "Image uploaded successfully, and person added successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error saving the person to the database.');
      });
  }else{
    SimilarityModel.findByIdAndUpdate(
      id, // 'id' used to identify the person
      { imagePath: req.file.path }, // Update the 'imagePath' property
      { new: true } // Return the updated document
    )
      .then((updatedPerson) => {
        if (!updatedPerson) {
          return res.status(404).json({
            status: false,
            message: 'Person not found.',
          });
        }
        res.json({
          id: updatedPerson._id,
          status: true,
          message: 'Image updated successfully.',
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error updating the person in the database.');
      });
  }
};

exports.getPersonImage = (req, res) => {
  SimilarityModel.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).send('Person not found.');
      }

      if (!person.imagePath) {
        return res.status(404).send('Image not found.');
      }
      res.set('Content-Type', 'image/jpeg');
      file = path.join(__dirname, person.imagePath)
      file = file.replace('\\controllers', '')
      console.log(file, typeof(file))
      res.sendFile(file);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving the person from the database.');
    });
}