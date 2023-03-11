// Librarys
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');


const app = express();

// Deal to frontend and backend

app.use(cors());

// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  });

// Define category schema

const categorySchema = new mongoose.Schema({
  name: String
});

const Category = mongoose.model('Category', categorySchema);

// Parse incoming requests data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// GET all categorie]

app.get('/allCategories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.send(categories);
  } catch (error) {
    console.log('Error getting categories', error);
    res.status(500).send('Error getting categories');
  }
});

// Create new folder inside selected category

app.post('/allCategories/:id/folders', async (req, res) => {
  const categoryId = req.params.id;
  const categorName = req.params.name;
  const folderName = req.body.name;

  // Check if category already exists

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).send('Category not found');
  }

  // Create new folder

  const categoryFolderPath = path.join(__dirname, `public/images/${category.name}`);
  const folderPath = path.join(categoryFolderPath, folderName);
  try {
    if (!fs.existsSync(categoryFolderPath)) {
      fs.mkdirSync(categoryFolderPath);
    }
    fs.mkdirSync(folderPath);
    console.log(`Created folder: ${folderPath}`);
    res.send(`Created folder: ${folderPath}`);
  } catch (error) {
    console.log('Error creating folder', error);
    res.status(500).send('Error creating folder');
  }
});

// Add a new category

app.post('/categories', async (req, res) => {
  const categoryName = req.body.name;

  // Check if category already exists

  const existingCategory = await Category.findOne({ name: categoryName });
  if (existingCategory) {
    console.log(`Category '${categoryName}' already exists`);
    return res.status(400).send(`Category '${categoryName}' already exists`);
  }

  // Create new category
  const category = new Category({
    name: categoryName
  });

  try {
    await category.save();
    console.log(`Added category: ${categoryName}`);
    res.send(`Added category: ${categoryName}`);
  } catch (error) {
    console.log('Error adding category', error);
    res.status(500).send('Error adding category');
  }
});

// Setup multer storage


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { categoryId, folderName } = req.params;

    // Validate the categoryId and folderName parameters

    if (!categoryId || !folderName) {
      return cb(new Error('Missing categoryId or folderName parameter'));
    }

    const folderPath = path.join(__dirname, `public/images/${categoryId}/${folderName}`);

    // Create the folder if it doesn't exist
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        return cb(new Error('Failed to create folder'));
      }

      cb(null, folderPath);
    });
  },
  filename: function (req, file, cb) {

    // Generate a unique filename for the uploaded file

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

const imageFilter = function (req, file, cb) {

  // Only allow certain types of images to be uploaded

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

app.post('/allCategories/:categoryId/folders/:folderName/upload', upload.array('files'), (req, res) => {
  console.log(req.files); 
  
  // This will log the uploaded files

  res.send(`${req.files.length} file(s) uploaded successfully.`);
  
});



// Text-To-Speech 

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: 'AKIASLMUWRQ47265KCAL',
  secretAccessKey: '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',
});


// Add a new endpoint for Text-To-Speech conversion

app.post('/allCategories/:categoryId/folders/:folderName/tts', async (req, res) => {
  const { categoryId, folderName } = req.params;
  const text = req.body.text;

  // Check if category exists

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).send('Category not found');
  }

  // Check if folder exists

  const folderPath = path.join(__dirname, `./public/images/${categoryId}/${folderName}`);
  if (!fs.existsSync(folderPath)) {
    // console.log('helooooo')
    return res.status(404).send('Folder not found');
  }

  // Generate MP3 file using Amazon Polly

  const polly = new AWS.Polly();
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna',
  };
  try {
    const data = await polly.synthesizeSpeech(params).promise();

    // Save MP3 file in folder
    const filePath = path.join(folderPath, `${Date.now()}.mp3`);
    fs.writeFileSync(filePath, data.AudioStream);

    res.send(`Saved MP3 file: ${filePath}`);
  } catch (error) {
    console.log('Error generating MP3 file', error);
    res.status(500).send('Error generating MP3 file');
  }
});




// Start the server

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});