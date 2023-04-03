import React from 'react'
import { useState } from 'react';
import axios from 'axios';
// import CategorySelect from './CategorySelect';
// import { CategoryID, folderName } from './CategorySelect';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const UploadImage = (props) => {

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [text, setText] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [fps, setFps] = useState(30);
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
      toast.success('Image Uploaded Successfully!', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT
      });
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
        toast.success('Video Uploaded Successfully!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });
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
        toast.success('Text Added!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });
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

    axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/generateVideo`, { fps })
      .then(response => {
        const videoUrl = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'video.mp4';
        a.click();
        URL.revokeObjectURL(videoUrl);
        setGenerateVideoResult(response.data);
        toast.success('Frames Added!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });
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
        window.location.reload();

        toast.success('Video merged Successfully :)!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });

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

  // Handle "finish" button click
  const handleFinishClick = () => {
    axios.post('http://localhost:8000/finish')
      .then(response => {
        console.log(response.data);
        window.location.reload();
        toast.success('Your Presentation is ready for Use :)', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        });
      })
      .catch(error => {
        console.error(error);
      });
  };


  return (
    <>
      <div className="container" id="mainPage">
        <p class="steph">Step 1:</p>
        <i class="far fa-images"></i>
        <h3>Upload Your Files</h3>
        <div class="row mt-5">
          <div class="col-sm-6 mb-3 mb-sm-0">
            <div class="card">
              <div class="card-body">
                <img
                  src="https://media.istockphoto.com/id/468616451/photo/abstract-background-defocused-green-and-blue.jpg?s=612x612&w=0&k=20&c=DLYcr3yaWPX0ZXvQG_Yy3PxvG1D1ubV-57FO2Al_-WY="
                  height="225"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">Upload Images here...</h5>
                  <p className="card-text">
                    Choose Images form your storage nad upload using upload
                    button.
                  </p>
                  <div className="input-group mb-3" id="chooseFile">
                    <input
                      className="form-control mx-3"
                      id="images"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                    />
                    <button
                      className="button"
                      id="loadUp"
                      onClick={handleUpload}
                    >
                      <span>Upload </span>
                    </button>
                  </div>
                  <p>{uploadStatus}</p>
                  {/* <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button> */}
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <img
                  src="https://media.istockphoto.com/id/468616451/photo/abstract-background-defocused-green-and-blue.jpg?s=612x612&w=0&k=20&c=DLYcr3yaWPX0ZXvQG_Yy3PxvG1D1ubV-57FO2Al_-WY="
                  height="225"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">Upload Videos here...</h5>
                  <p className="card-text">
                    Choose Videos form your storage nad upload using upload
                    button.
                  </p>
                  <div className="input-group mb-3" id="chooseFile">
                    <input
                      className="form-control mx-3"
                      id="images"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                    <button
                      className="button"
                      id="loadUp"
                      onClick={handleVideoSubmit}
                    >
                      <span>Upload </span>
                    </button>
                  </div>
                  <p>{uploadStatus}</p>
                  {/* <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div id="preloadertts" >    
                    <div class="ttsloading">
                        <img src="C:\Users\Lenovo\OneDrive\Desktop\nrsc-app\nrsc-app\images\loading.gif" alt="loading......"/>
                    </div>
                    <p>Please wait..Don't go to next step.</p>
                </div> */}
        <div className="contanier my-5 " id="textIn">
          <div className="container">
            <div className="mb-3 my-4">
              <p class="steph">Step 2:</p>
              <i class="fas fa-music"></i>
              <h3>Compose Your Background Track</h3>
              <textarea
                className="form-control"
                id="text-input"
                rows="10"
                value={text}
                onChange={handleTextChange}
                placeholder="Remember! Be nice."
              ></textarea>
            </div>
            <button
              onClick={handleConvertClick}
              className="container button"
              id="converText"
            >
              <span>Upload </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mb-3">
        {/* <label htmlFor="audio-input" className="form-label" id='selectAudio'>Select an audio file</label> */}
        {/* <input className="form-control" id="audio-input" type="file" accept="audio/*" onChange={handleAudioSelect} /> */}
        <div className="mb-3">
          <div className="text-center my-3">
            {/* <label>
              <h4>FPS:</h4>
              <input
                type="number"
                id="frame"
                value={fps}
                onChange={(event) => setFps(event.target.value)}
              />
            </label> */}
            <button className="button my-2" onClick={handleVideoGen} id="addF">
              <span>Add Frame </span>
            </button>
            {videoUrl && <video src={videoUrl} controls />}
          </div>
        </div>
      </div>
      <div className="container ">
        <div className="container my-2" id='mergeVid'>
          <button className="button" id="mVid" onClick={handleSubmit}>
            <span>Merge Videos </span>
          </button>
          {mergeVideosResult && <p>{mergeVideosResult}</p>}
        </div>
        <div className="container">
          <div className="row">
            {videos.map((video) => (
              <div key={video.path} className="col-md-4">
                <div className="card mb-4 shadow-sm">
                  <button
                    className="button"
                    onClick={() => handleDeleteVideo(video.name)}
                  >
                    <span>Delete </span>
                  </button>
                  <div className="card-body">
                    <h2 className="card-title">{video.name}</h2>
                    <div className="embed-responsive embed-responsive-16by9">
                      <video
                        src={video.path}
                        controls
                        className="embed-responsive-item"
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container my-2" id="fin">
          <button className="button" id="finBt" onClick={handleFinishClick}>
            <span>Finish </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadImage;

