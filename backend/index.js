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






app.get('/allCategories/:id/folders', async (req, res) => {
  const categoryId = req.params.id;

  // Check if category already exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).send('Category not found');
  }

  const categoryFolderPath = path.join(__dirname, `public/images/${category.name}`);

  try {
    // Read all folders in the category folder
    const folders = fs.readdirSync(categoryFolderPath);
    const folderList = folders.map(folder => ({
      name: folder,
      path: path.join(categoryFolderPath, folder)
    }));

    res.send(folderList);
  } catch (error) {
    console.log('Error fetching folders', error);
    res.status(500).send('Error fetching folders');
  }
});





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






// ******************** Task 6 **********************









let videoCounter = 1;



// Upload video

//  setup multer storage


const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = './uploads';
    cb(null, folderPath)
  },
  filename: function (req, file, cb) {
    const fileName = `video${videoCounter}.mp4`
    cb(null, fileName)
  }
})

const videoFilter = function (req, file, cb){

  // Only allow certain types of images to be uploaded

  if(!file.originalname.match(/\.(mp4)$/)){
    return cb(new Error('Only video files are allowed'))
  }
  cb(null, true);
}

const uploadd = multer({ storage: storagee, fileFilter: videoFilter });

app.post('/uploadVideos', uploadd.array('video'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file selected for upload. Please choose a video file to upload using the "video" field.')
    
  }

  else {
    // Process the uploaded file here
    videoCounter++;
    return res.status(200).send('File uploaded successfully.');
  }
});







// **************************************************





// ******************   Task 7   ********************






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
    const fileName = 'audio.mp3';
    // Combine folder path and file name
    const filePath = path.join(folderPath, fileName);
    // Write MP3 data to file
    fs.writeFileSync(filePath, data.AudioStream);


    // Send response

    res.send({ message: `Saved MP3 file: ${filePath}`, fileName: fileName, });
  } catch (error) {
    console.log('Error generating MP3 file', error);
    res.status(500).send('Error generating MP3 file');

  }
});







// ******************  Task 8   ******************






// **********************   Main    ********************






let videoPaths = [];

app.post('/allCategories/:categoryId/folders/:folderName/generateVideo', (req, res) => {
  const { categoryId, folderName, } = req.params;
  const imagesPath = path.join(__dirname, `public/images/${categoryId}/${folderName}`);
  // const outputVideoPath = path.join(__dirname, `public/images/${categoryId}/${folderName}/video.mp4`);
  const outputVideoPath = `uploads/video${videoCounter}.mp4`

  const fileListPath = path.join(imagesPath, 'filelist.txt');
  const audioPath = path.join(__dirname, `public/images/${categoryId}/${folderName}/audio.mp3`);

  // Use the user-specified FPS or default to 30
  // const fps = req.body.fps || 30; 
  // console.log(fps)

  // Check if audio file exists
  if (!fs.existsSync(audioPath)) {
    return res.status(404).send('Audio file not found');
  }



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
    '-r', `1/5`,
    '-f', 'concat',
    '-safe', '0',
    '-i', fileListPath,
    '-i', audioPath,
    '-vf', 'scale=-2:720',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '192k',
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
      videoPaths.push(outputVideoPath);
      res.send(`Video generated successfully: ${outputVideoPath}`);
     videoCounter++;
    } else {
      res.status(500).send('Failed to generate video');
    }
    // Remove the filelist.txt file
    fs.unlinkSync(fileListPath);
    fs.unlinkSync(audioPath);
    fs.readdirSync(imagesPath)
      .filter(file => (/\.(jpg|jpeg|png|gif)$/i).test(file))
      .forEach(file => fs.unlinkSync(path.join(imagesPath, file)));
  });
});

// console.log(videoPaths)
// console.log('hellloooooo')



// **********************************************************************************






// ----------------------------------------------------------------------------------






// ************************ Task 9 Merge All Videos *********************************





app.post('/convert_videos', async (req, res) => {
  try {
    // Path for inserting the video
    const videosPath = `./uploads`;
    const outputFilePath = `videos/${Date.now()}-output.mp4`
    const fileListPath = path.join(videosPath, 'filelist.txt');
    const audioFilePath = `./audio/background-music.mp3`;

    // Create an array of video file paths in the specified folder
    const fileList = fs.readdirSync(videosPath)

    // filter all videos types and sort them by serial number
      .filter((file) => file.endsWith('.mp4')) 
      .sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)))

    // create an array of video file paths with their serial number
    const filesWithPath = fileList.map(file => ({
      path: path.join(videosPath, file),
      serialNumber: parseInt(file.match(/\d+/))
    }))

    // create a string with the paths of the videos in order of their serial number
    const fileListString = filesWithPath.map(file => `file '${file.path}'`).join('\n')

    // create a filter complex to merge audio with video
    const filterComplex = `-filter_complex "[0:a]aformat=fltp:44100:stereo, volume=0.5[a1];[1:a]aformat=fltp:44100:stereo, volume=0.5[a2];[a1][a2]amerge=inputs=2[aout]" -map "[aout]"`;

    // write the file list to the filelist.txt
    fs.writeFileSync(fileListPath, fileListString); 

    const child = spawn('ffmpeg', ['-safe', '0', '-f', 'concat', '-i', fileListPath, '-i', './audio/background-music.mp3', '-filter_complex', '[0:a]aformat=fltp:44100:stereo, volume=0.5[a1];[1:a]aformat=fltp:44100:stereo, volume=0.5[a2];[a1][a2]amerge=inputs=2[aout]', '-map', '0:v', '-map', '[aout]', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22', '-y', outputFilePath]);


    // Listen for errors from the FFmpeg process
    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Listen for completion of the FFmpeg process
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`FFmpeg process exited with code ${code}`);

        // Respond to the client with a success message
        res.json({
          message: `Videos in ${videosPath} have been concatenated successfully.`,
          outputFilePath
        });
      } else {
        console.error(`FFmpeg process exited with code ${code}`);

        // Respond to the client with an error message
        res.status(500).json({
          message: 'An error occurred while concatenating the videos.',
        });
      }
      
      // remove the filelist.txt
      fs.unlinkSync(fileListPath);
    });
  } catch (error) {
    console.error(error);
    // Respond to the client with an error message
    res.status(500).json({
      message: 'An error occurred while concatenating the videos.',
    });
  }
});








// ******************************************************************************

// ************************  Task 10 Make a list of all video *******************

const folderPath = './uploads';
const videoExtensions = ['.mp4', '.avi', '.mkv']

app.get('/videos', (req, res) => {
  const videos = [];

  // Read all files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    // Filter files to only include video files
    files.filter(file => videoExtensions.includes(path.extname(file))).forEach(file => {
      const video = {
        name: path.basename(file, path.extname(file)),
        path: path.join(folderPath, file)
      };
      videos.push(video);
    });

    res.json(videos);
  });
});



// ******************************** Task 11**********************************************

app.delete('/videos/:videoName', (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(folderPath, videoName + '.mp4'); // assuming all video files have the .mp4 extension

  // Check if the video file exists
  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send('Video not found');
    }

    // Delete the video file
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
      }

      res.send('Video deleted successfully');
    });
  });
});

// ******************************************************************************


// ******************************* Task 12***************************************


app.post('/finish', (req, res) => {
  const folderPath = './uploads';

  // Read all files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    // Delete all files in the folder
    
    files.forEach(file => {
      fs.unlink(path.join(folderPath, file), err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal server error');
        }
      });
    });

    // Reset the video counter

    videoCounter = 1;

    // Send a success response
    
    res.send('Upload folder has been emptied');
  });
});



// ******************************************************************************


// Start the server

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});