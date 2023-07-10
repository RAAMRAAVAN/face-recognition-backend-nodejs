// app.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Create the Express app
const app = express();

// Set up Multer for file uploads
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ dest: 'uploads/' });
// Connect to MongoDB
mongoose.connect('mongodb+srv://rambaburai911:Ram911@zomato.bilturd.mongodb.net/zomato?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema and model for persons
const personSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
});

const Person = mongoose.model('Person', personSchema);
app.use('/uploads', express.static('uploads'));

// Define route for handling image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  // Save the image path or unique name to the database
  const person = new Person({
    name: req.body.name,
    imagePath: req.file.path, // Assuming the file path is stored in the 'path' property
  });

  person.save()
  .then(() => {
    res.send('Person saved successfully.');
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error saving the person to the database.');
  });
});

// Define route for generating image URLs
app.get('/person/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).send('Person not found.');
      }

      if (!person.imagePath) {
        return res.status(404).send('Image not found.');
      }
      res.set('Content-Type', 'image/jpeg');
      res.sendFile(path.join(__dirname, person.imagePath));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving the person from the database.');
    });
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
