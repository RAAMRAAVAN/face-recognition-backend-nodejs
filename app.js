// create server
const express = require("express");
const multer = require('multer');
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Instance
const app = express();
const PORT = 5000;
const upload = multer({ dest: 'uploads/' });
// app.use('/uploads', express.static('uploads'));
// const URI = "mongodb+srv://rambaburai911:Ram911@zomato.bilturd.mongodb.net/face_recognition?retryWrites=true&w=majority";
const URI = "mongodb://127.0.0.1:27017/face_recognition"
// const host = "localhost";

const APIRoutes = require("./Routes/APIRoutes");
app.use(cors())
// Increase the maximum size limit for parsing the request body
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use('/uploads', express.static('uploads'));
// Enable access to POST data (body parser)
app.use(express.json()) //converts string data to purejson data
app.use(express.urlencoded({extended:false})) // converts normal post data to json data, exclude params data
// Inject Routes in App
app.use("/", APIRoutes);
// Listener
console.log("connecting to DB..")
mongoose.set('strictQuery', true);
mongoose
  .connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
        console.log("DB connected successfully")
      console.log(`Face Recognition server is running on  ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
