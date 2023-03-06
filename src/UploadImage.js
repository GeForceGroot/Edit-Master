import React from 'react'
import { useState } from 'react';
import axios from 'axios';
// import CategorySelect from './CategorySelect';
// import { CategoryID, folderName } from './CategorySelect';
import { useLocation } from 'react-router-dom';

const UploadImage = (props) => {

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();
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


  const handleGetCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/allCategories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error getting categories', error);
    }
  };



  return (
    <>
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
                    <button className="input-group-text" id='loadUp' onClick={handleUpload}>Upload</button>
                  </div>
                  <p>{uploadStatus}</p>
                  <button onClick={handleGetCategories} id='upImgLoad'>Refresh Categories</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadImage;

