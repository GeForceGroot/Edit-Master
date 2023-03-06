  import React, { useState, useEffect } from 'react';
  import { useHistory } from "react-router-dom";
  import axios from 'axios';

  function CategorySelect() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [folderName, setFolderName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');



    useEffect(() => {
      const fetchCategories = async () => {
        try {
          // Send GET request to API endpoint to get categories
          const response = await axios.get('http://localhost:8000/allCategories');
          setCategories(response.data);
        } catch (error) {
          console.log('Error getting categories', error);
        }
      };
      fetchCategories();
    }, []);

    const handleSelectChange = (event) => {
      setSelectedCategory(event.target.value);
    }
    useEffect(() => {
      axios.get('http://localhost:8000/allCategories')
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.log('Error getting categories', error);
        });
    }, []);

    const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
    };

    const handleFolderNameChange = (event) => {
      setFolderName(event.target.value);
    };


    const handleFileSelect = (event) => {
      setSelectedFiles(event.target.files);
    };

    const history = useHistory();

    const handleCreateFolder = () => {
      if (selectedCategory && folderName) {
        axios.post(`http://localhost:8000/allCategories/${selectedCategory}/folders`, {
          name: folderName
        })
          .then((response) => {
            console.log(response.data);
            setFolderName(folderName);
            let path = `/uploadImage`;
            history.push(path, { categoryId: selectedCategory, folderName: folderName });
          })
          .catch((error) => {
            console.log('Error creating folder', error);
          });
      }
                   
    };
    


  const handleUpload = async () => {

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
  
    try {
      const response = await axios.post(`http://localhost:8000/allCategories/${selectedCategory}/folders/${folderName}/upload`, formData, {
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
    <div className="container" id="in2">
      <div className="row">
        <div className="col text-end " id="gory1">
          <i className="fa fa-list-alt fa-2x" aria-hidden="true"></i>
        </div>
        <div className="col text-start" style={{ fontSize: "1.3rem" }} id='eg'>
          <b>
            Select Category
          </b>
        </div>
      </div>
      <div className="container text-center  my-3">
        <select value={selectedCategory} onChange={handleCategoryChange} className="form-select " aria-label="Default select example" id='menu'>
          <option value="">--Select a category--</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="container" id="in3">
      <div className="row" id="btn_cat">
        <div className="col text-end " id='gory2'>
          <i className="fa-regular fa-file fa-2x" id="btn_cat"></i>
        </div>
        <div className="col text-start" style={{ fontSize: "1.3rem" }} id='eg1'>
          <b>
            Enter Your File Name
          </b>
        </div>
      </div>
      <div className="container text-center  my-3">
        <input type="text" id="file_name" value={folderName} onChange={handleFolderNameChange} name="filename" form="Form1" autoComplete="off" />
      </div>
    </div>
    <div className="position-relative my-4">
      <div className="position-absolute bottom-0 end-0 my-4 mx-4">
        <button type="button" onClick={handleCreateFolder} className="btn btn-primary mx-4" id="cat_button">Next</button>
      </div>
    </div>
    <div>
    {/* <label htmlFor="images">Select Images:</label> */}
      {/* <input id="images" type="file" multiple onChange={handleFileSelect} />
      <br />
      <button onClick={handleUpload}>Upload</button>
      <br />
      <p>{uploadStatus}</p>
      <button onClick={handleGetCategories}>Refresh Categories</button> */}
    </div>
  </>
  );
}

export default CategorySelect;
