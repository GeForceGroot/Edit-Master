import React from 'react'
import { useState } from 'react';
import axios from 'axios';
// import CategorySelect from './CategorySelect';
// import { CategoryID, folderName } from './CategorySelect';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useEffect } from 'react';

const UploadImage = (props) => {

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [text, setText] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [fps, setFps] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [images, setImages] = useState([]);
  const [framerate, setFramerate] = useState('30');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [videoUrl, setVideoUrl] = useState(null);
  const [folderPath, setFolderPath] = useState('');
  const [message, setMessage] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generateVideoResult, setGenerateVideoResult] = useState('');
  const [mergeVideosResult, setMergeVideosResult] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoName, setVideoName] = useState('');



  const location = useLocation();
  // const history = useHistory();
  const categoryId = location.state.categoryId;
  const folderName = location.state.folderName;

  const handleUpload = async () => {

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus(response.data);

    } catch (error) {
      console.log('Error uploading images', error);
      setUploadStatus('Error uploading images');
    }
  }
  const handleFileSelect = (event) => {
    setSelectedFiles(event.target.files);
  };


  const handleTextChange = (event) => {
    setText(event.target.value);
  };
  const handleFileInputChange = (event) => {
    setSelectedFiles(event.target.files);
  };


  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };
  const handleFramerateChange = (event) => {
    setFramerate(event.target.value);
  }
  const handleOutputFormatChange = (event) => {
    setOutputFormat(event.target.value);
  }
  // Handle file input change

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  

  const handleVideoSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('video', selectedFile);
  
    try {
      const response = await axios.post('http://localhost:8000/uploadVideos', formData);
  
      if (response.status === 200) {
        alert('File uploaded successfully.');
      } else {
        alert('Error uploading file.');
      }
    } catch (error) {
      alert('Error uploading file.');
      console.error(error);
    }
  };



  const handleGetCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/allCategories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error getting categories', error);
    }
  };


  const handleConvertClick = () => {

    // Send a POST request to server to convert text

    axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/tts`, {
      category: categoryId,
      folder: folderName,
      text: text
    })
      .then(response => {
        console.log('Conversion successful', response.data);

        // Clear text input

        setText('');
      })
      .catch(error => console.log('Error converting text', error));
  }
  const handleAudioSelect = (event) => {
    setSelectedAudio(event.target.files[0]);
  };
  const handleVideoGen = (event) => {
    event.preventDefault();

    // const formData = new FormData();
    // images.forEach((image) => {
    //   formData.append('images', image);
    // });
    // formData.append('framerate', framerate);
    // formData.append('outputFormat', outputFormat);

    axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/generateVideo`)
      .then(response => {
        const videoUrl = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'video.mp4';
        a.click();
        URL.revokeObjectURL(videoUrl);
        setGenerateVideoResult(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create a FormData object and append each file to it
      const formData = new FormData();
      for (let i = 0; i < videoFiles.length; i++) {
        formData.append('videos', videoFiles[i]);
      }

      // Send a POST request to the /convert_videos endpoint
      const response = await axios.post('http://localhost:8000/convert_videos', formData);

      if (response.status === 200) {
        const data = response.data;
        setResultMessage(data.message);
      } else {
        setErrorMessage('An error occurred while merging the videos.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while merging the videos.');
    }
  };
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios.get('http://localhost:8000/videos');
        setVideos(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchVideos();
  }, []);


  // Handle video deletion
  const handleDeleteVideo = (videoName) => {
    axios.delete(`http://localhost:8000/videos/${videoName}`)
      .then(() => setVideos(videos.filter(video => video.name !== videoName)))
      .catch(error => console.error(error));
  }
  

  return (
    <>
      <div className="container" id='mainPage'>
        <div className="container" id='secat1'>
          <div className="uploadImage text-center">
            <div className="contaier text-center my-5" id='upImg'>
              <div className="container text-center my-5">
                <div className="card my-5" id='uploadImg'>
                  <img src="https://media.istockphoto.com/id/468616451/photo/abstract-background-defocused-green-and-blue.jpg?s=612x612&w=0&k=20&c=DLYcr3yaWPX0ZXvQG_Yy3PxvG1D1ubV-57FO2Al_-WY=" height='225' className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Upload Images here...</h5>
                    <p className="card-text">Choose Images form your storage nad upload using upload button.</p>
                    <div className="input-group mb-3" id='chooseFile'>
                      <input className="form-control mx-3" id="images" type="file" multiple onChange={handleFileSelect} />
                      <button className="input-group-text" id='loadUp' onClick={handleUpload}>Upload Image</button>
                    </div>
                    <p>{uploadStatus}</p>
                    <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
        <div className="container" id='secat11'>
          <div className="uploadImage text-center">
            <div className="contaier text-center my-5" id='upImgg'>
              <div className="container text-center my-5">
                <div className="card my-5" id='uploadImg'>
                  <img src="https://media.istockphoto.com/id/468616451/photo/abstract-background-defocused-green-and-blue.jpg?s=612x612&w=0&k=20&c=DLYcr3yaWPX0ZXvQG_Yy3PxvG1D1ubV-57FO2Al_-WY=" height='225' className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Upload Videos here...</h5>
                    <p className="card-text">Choose Videos form your storage nad upload using upload button.</p>
                    <div className="input-group mb-3" id='chooseFile'>
                      <input className="form-control mx-3" id="images" type="file" multiple onChange={handleFileChange} />
                      <button className="input-group-text" id='loadUp' onClick={handleVideoSubmit}>Upload Video</button>
                    </div>
                    <p>{uploadStatus}</p>
                    <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="contanier my-5 " id='textIn'>
          <div className="container" >
            <div className="mb-3 my-4" >
              <label htmlFor="text-input" className="form-label" id='EnterText' >Enter text here...</label>
              <textarea className="form-control" id="text-input" rows="10" value={text} onChange={handleTextChange}></textarea>
            </div>
            <button onClick={handleConvertClick} className="btn btn-primary " id='converText'>Upload Text...</button>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="audio-input" className="form-label" id='selectAudio'>Select an audio file</label>
        <input className="form-control" id="audio-input" type="file" accept="audio/*" onChange={handleAudioSelect} />
        <div className="mb-3">
          <div className="text-center my-3" >
            <button className="btn btn-primary" onClick={handleVideoGen} id='genVid'>Add Frame</button>
            {videoUrl && <video src={videoUrl} controls />}
          </div>
        </div>
      </div>
      <div className="container">
        <div>
          <button onClick={handleSubmit}>Merge videos</button>
          {mergeVideosResult && <p>{mergeVideosResult}</p>}
        </div>
      </div>
      <div >
      <h1>Videos List</h1>
      {videos.map(video => (
        <div key={video.path} >
          <div className='container my-2 text-center' id='allVid'>
          <button onClick={() => handleDeleteVideo(video.name)}>Delete</button>
          <h2>{video.name}</h2>
          <video src={video.path} controls></video>
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default UploadImage;

