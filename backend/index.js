// Librarys
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const { spawn } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { count } = require('console');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
// const groupName = 'NodeJS'
// exec(`net localgroup ${groupName} Tiwar /add`, (err, stdout, stderr) => {
//   if (err) {
//     console.error(`Error executing command: ${err}`);
//     return;
//   }

//   if (stderr) {
//     console.error(`Command returned an error: ${stderr}`);
//     return;
//   }

//   console.log(`Group '${groupName}' created`);
// });

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
  // const categorName = req.params.name;
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
      // cb(null, './uploads');
    });
  },
  filename: function (req, file, cb) {

    // Generate a unique filename for the uploaded file

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
    // cb(null, `${Date.now()}-${file.originalname}`);

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
  accessKeyId: 'Your_Access_Key_Id',
  secretAccessKey: 'Your_Secret_Access_Key',
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


// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
//   const { categoryId, folderName } = req.params;
//   const imagesPath = path.join(__dirname, `./public/images/${categoryId}/${folderName}`);
//   // const outputVideoPath = path.join(__dirname, 'public/videos');
//   // const fileListPath = path.join(imagesPath, 'filelist.txt');
//   const videoName = 'video.mp4';

//   // Write the list of image file paths to the filelist.txt file

//  if (!fs.existsSync(imagesPath)) {
//     return res.status(400).send('Images directory does not exist');
//   }

//   const fps = 25;
//   // Get list of image filenames
//   const images = fs.readdirSync(imagesPath)
//     .filter(filename => filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'))
//     .map(filename => path.join(imagesPath, filename));

//     // console.log(__dirname)

   
//   // Check if there are any images
//   if (images.length === 0) {
//     return res.status(400).send('No images found');
//   }

//   // Create ffmpeg command to generate video from images
//   const ffmpegCommand = ffmpeg();
//   images.forEach(image => {
//     ffmpegCommand.input(image);
//   });
//  ffmpegCommand.outputOptions('-framerate', fps, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-vf', 'scale=1920:1280', '-r', '1/10');
//   ffmpegCommand.output(path.join(imagesPath, videoName));

//   // Execute ffmpeg command
//   ffmpegCommand.on('end', () => {
//     res.sendFile(path.join(imagesPath, videoName), () => {
//       // Delete uploaded images and video file
//       fs.readdirSync(imagesPath)
//         // .forEach(filename => fs.unlinkSync(path.join(imagesPath, filename)));
//       // fs.unlinkSync(path.join(imagesPath, videoName));
//     });
//   });
//   ffmpegCommand.run();

// });




// **********************   Main ********************





app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
  const { categoryId, folderName } = req.params;
  const imagesPath = path.join(__dirname, `public/images/${categoryId}/${folderName}`);
  const outputVideoPath = path.join(__dirname, `public/images/${categoryId}/${folderName}/video.mp4`);
  const fileListPath = path.join(imagesPath, 'filelist.txt');
 const fps = 30;
  // Write the list of image file paths to the filelist.txt file
  const fileList = fs.readdirSync(imagesPath)
  // filter all image types
  .filter(file => (/\.(jpg|jpeg|png|gif)$/i).test(file)) 
  .sort((a, b) => parseInt(a) - parseInt(b))
  .map(file => `file '${path.join(imagesPath, file)}'`)
  .join('\n');
fs.writeFileSync(fileListPath, fileList);

  // Use FFmpeg to generate a video from the list of images
  const ffmpegProcess = spawn('ffmpeg', [
    '-r', '1/3',
    '-f', 'concat',
    '-safe', '0',
    '-i', fileListPath,
    '-vf', 'scale=-2:720',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputVideoPath
  ]);
  

  // Listen for errors and output messages from the FFmpeg process
  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg output: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    if (code === 0) {
      res.send(`Video generated successfully: ${outputVideoPath}`);
    } else {
      res.status(500).send('Failed to generate video');
    }
    // Remove the filelist.txt file
    fs.unlinkSync(fileListPath);
  });
});








// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
//   const { categoryId, folderName } = req.params;
//   const imagesPath = path.join(__dirname, `public/images/${categoryId}/${folderName}`);
//   const outputVideoPath = path.join(__dirname, 'public/videos/video.mp4');
//   const fileListPath = path.join(imagesPath, 'filelist.txt');
//   // const videoName = 'video.mp4';

//   // Write the list of image file paths to the filelist.txt file
//   const fileList = fs.readdirSync(imagesPath)
//     .filter(file => file.endsWith('.jpg'))
//     .sort((a, b) => parseInt(a) - parseInt(b))
//     .map(file => `file '${path.join(imagesPath, file)}'`)
//     .join('\n');
//   fs.writeFileSync(fileListPath, fileList);


//   const ffmpegProcess = spawn('ffmpeg', [
//     '-f', 'concat',
//     '-safe', '0',
//     '-i', fileListPath,
//     '-c:v', 'libx264',
//     '-pix_fmt', 'yuv420p',
//     '-movflags', '+faststart',
//     outputVideoPath
//   ]);

//   ffmpegProcess.on('end', () => {
//     console.log('Video created successfully');
//   })
//   ffmpegProcess.on('error', (err) => {
//     console.error('Error creating video:', err);
//   })
//   .run();
  
//   // const ffmpegProcess = ffmpeg();
//   // Use FFmpeg to generate a video from the list of images
  
//   // ffmpegProcess.run();
//   console.log('heloooooo')

  
//     // Remove the filelist.txt file
//     // fs.unlinkSync(fileListPath);
 
// });





















// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
//   const { categoryId, folderName } = req.params;
//   const videoName = 'video.mp4';
//   // const { files } = req;

//   // Validate the uploaded files

//   // if (!files || !Array.isArray(files) || files.length === 0) {
//   //   return res.status(400).send('No files uploaded');
//   // }

//   // Convert the uploaded images to a video using FFmpeg

//   // const videoPath = path.join(__dirname, 'public/videos/output.mp4');
//   const imagePaths = path.join(__dirname, `./public/images/${categoryId}/${folderName}`);
//   const fps = 30;

//   const images = fs.readdirSync(imagePaths)
//     .filter(filename => filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'))
//     .map(filename => path.join(imagePaths, filename));

//     // console.log(images);

//     const ffmpegCommand = ffmpeg();
//   images.forEach(image => {
//     ffmpegCommand.input(image);
//   });


//   ffmpegCommand.outputOption(
//     '-y', 
//     '-framerate', fps,
//     '-vf', `scale='if(gt(a,16/9),1280,-1)':if(gt(a,16/9),-1,720),setdar=16/9`,
//     '-pix_fmt', 'yuv420p',
//     '-c:v', 'libx264',
//     '-crf', '18',
//     '-preset', 
//     'slow'
//   );

//   ffmpegCommand.output(path.join(imagePaths, videoName))

//   // Handle FFmpeg output and errors

//   ffmpegCommand.on('end', () => {
//         res.sendFile(path.join(imagePaths, videoName), () => {
//           // Delete uploaded images and video file
//           fs.readdirSync(imagePaths)
//             // .forEach(filename => fs.unlinkSync(path.join(imagesPath, filename)));
//           // fs.unlinkSync(path.join(imagesPath, videoName));
//         });
//       });
//       ffmpegCommand.run();
//       console.log('heloooooooooooo');
// });
























// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
//   const { categoryId, folderName } = req.params;
//   // const { fps, height, width } = req.body;

//   // Validate the categoryId and folderName parameters

//   if (!categoryId || !folderName) {
//     return res.status(400).json({ error: 'Missing categoryId or folderName parameter' });
//   }

//   // Set up the input and output paths

//   const inputPath = path.join(__dirname, `./public/images/${categoryId}/${folderName}`);
//   const outputPath = path.join(__dirname, `./public/images/${categoryId}/${folderName}`);

//   // Check that the input directory exists
//   // const files = fs.readdirSync(`${inputPath}`).sort((a, b) => a - b);
//   const ffmpegCommand = ffmpeg();

//   const fileFormat = path.extname(fs.readdirSync(__dirname)[0]);
//     if (fileFormat === '.jpg') {
//       ffmpegCommand.input(`${inputPath}`, '%03d.jpg');
//     } else if (fileFormat === '.png') {
//       ffmpegCommand.input(`${inputPath}`, '*.png');
//     } else {
//       const fileListPath = path.join(inputPath, 'image_list.txt');
//       const fileListContent = fs.readdirSync(inputPath).map((filename) => `file '${inputPath}/${filename}'`).join('\n');
//       fs.writeFileSync(fileListPath, fileListContent);
//       ffmpegCommand.input(`${fileListPath}`);
//     }


//     // Add the input images based on the file format

    

//     ffmpegCommand
//       // set the output path

//       .output(outputPath)

//       // set the frame rate to 30 frames per second
//       .fps(30)
//       .on('end', () => {

//         // Send the response with the path to the generated video

//         res.json({ videoPath: outputPath });
//       })
//       .on('error', (err) => {
//         console.log('Error generating video:', err);
//         res.status(500).json({ error: 'Error generating video' });
//       })
//       .run();
  
// });















// define route for video generation
// app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', upload.single('files'), (req, res) => {
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