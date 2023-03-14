// Librarys
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const groupName = 'NodeJS'
exec(`net localgroup ${groupName} /add`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing command: ${err}`);
    return;
  }

  if (stderr) {
    console.error(`Command returned an error: ${stderr}`);
    return;
  }

  console.log(`Group '${groupName}' created`);
});

// Deal to frontend and backend

app.use(cors());

// ******************   Task 1   ********************

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



// ******************   Task 3   ********************


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


// ******************   Task 4   ********************


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



// ******************   Task 2   ********************


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


// ******************   Task 5   ********************

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


// ******************   Task 6   ********************


// Text-To-Speech 

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: 'AKIASLMUWRQ47265KCAL',
  secretAccessKey: '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',
});



// Add a new endpoint for Text-To-Speech conversion


app.post('/allCategories/:categoryId/folders/:folderName/tts', upload.single('mp3'), async (req, res) => {
  const { categoryId, folderName } = req.params;
  const text = req.body.text;
  // const filePath = req.file.path

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


    // Generate a unique file name
    const fileName = `${Date.now()}.mp3`;
    // Combine folder path and file name
    const filePath = path.join(folderPath, fileName);
    // Write MP3 data to file
    fs.writeFileSync(filePath, data.AudioStream);


// Send response

    res.send(`Saved MP3 file: ${filePath}`);
  } catch (error) {
    console.log('Error generating MP3 file', error);
    res.status(500).send('Error generating MP3 file');
    
  }
});


// ****************** Final Task 7   ********************

// End point for generating video file


app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
  const { categoryId, folderName } = req.params;

  // Validate the categoryId and folderName parameters
  if (!categoryId || !folderName) {
    return res.status(400).json({ error: 'Missing categoryId or folderName parameter' });
  }

  // Set up the input and output paths
  const inputPath = path.join(__dirname, '../../../videoGenImg');
  const outputPath = path.join(__dirname, `public/videos/${categoryId}/${folderName}.mp4`);

  // Check that the input directory exists
  fs.access(inputPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Input directory does not exist' });
    }

    // Use ffmpeg to create the video
    const ffmpegCommand = ffmpeg();

    // Add the input images based on the file format
    const fileFormat = path.extname(fs.readdirSync(inputPath)[0]);
    if (fileFormat === '.jpg') {
      ffmpegCommand.input(`${inputPath}`, '%03d.jpg');
    } else if (fileFormat === '.png') {
      ffmpegCommand.input(`${inputPath}`, '*.png');
    } else {
      const fileListPath = path.join(inputPath, 'image_list.txt');
      const fileListContent = fs.readdirSync(inputPath).map((filename) => `file '${inputPath}/${filename}'`).join('\n');
      fs.writeFileSync(fileListPath, fileListContent);
      ffmpegCommand.input(`-f concat -i ${fileListPath}`);
    }

    ffmpegCommand
      .output(outputPath) // set the output path
      .fps(30) // set the frame rate to 30 frames per second
      .on('end', () => {
        // Send the response with the path to the generated video
        res.json({ videoPath: outputPath });
      })
      .on('error', (err) => {
        console.log('Error generating video:', err);
        res.status(500).json({ error: 'Error generating video' });
      })
      .run();
  });
});















// // define route for video generation
// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', upload.array('files'), (req, res) => {
//   const audioFile = req.files.find((file) => file.fieldname === 'audio');
//   const videoFiles = req.files.filter((file) => file.fieldname === 'files');

//   // TODO: Generate video using the audio and video files
//   // ...

//   // TODO: Send the generated video file to the client
//   // ...

//   // send a dummy response for now
//   res.send('Video generation complete');
// });





// Start the server

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});