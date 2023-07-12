const Person = require("../models/PersonModel")
const adjModel = require("../models/AdjModel")
const latentModel = require("../models/LatentModel")
const featureModel = require("../models/FeatureModel")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');

// Define route for handling image uploads
exports.getPersons = async(req, res) =>{
  try {
    const persons = await Person.find();
    const data = await Promise.all(
      persons.map(async (person) => {
        const personData = { ...person.toObject()};
        return personData;
      })
    );
    let result = {status:true, data: data}
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Controller function for creating a person
exports.createPerson = (req, res) => {
  // Save the image path or unique name to the database
  let id = req.body.id;
  console.log("id=",id)
  if(id === undefined){
    const person = new Person({
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
    Person.findByIdAndUpdate(
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

// Define route for generating image URLs
exports.getPersonImage = (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).send('Person not found.');
      }

      if (!person.imagePath) {
        return res.status(404).send('Image not found.');
      }
      res.set('Content-Type', 'image/jpeg');
      console.log("dir=",__dirname )
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

exports.getPersonName = (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).send('Person not found.');
      }
      if (!person.imagePath) {
        return res.status(404).send('Person not found.');
      }
      res.send(person.name);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving the person from the database.');
    });
}

