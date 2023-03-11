import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 




function TextToSpeech() {

   
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [text, setText] = useState('');
    const location = useLocation();
    const categoryId = location.state.categoryId;
    const folderName = location.state.folderName; 
    
    

    // useEffect(() => {
    //     // Fetch all categories from server
    //     axios.get('http://localhost:8000/allCategories')
    //         .then(response => setCategories(response.data))
    //         .catch(error => console.log('Error fetching categories', error));
    // }, []);

    // const handleCategoryChange = (event) => {
    //     setSelectedCategory(event.target.value);

    //     // Fetch all folders for selected category
    //     axios.get(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}`)
    //         .then(response => setFolders(response.data))
    //         .catch(error => console.log('Error fetching folders', error));
    // };

    // const handleFolderChange = (event) => {
    //     setSelectedFolder(event.target.value);
    // };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleConvertClick = () => {
        // Send a POST request to server to convert text
        
        axios.post(`http://localhost:8000/allCategories/${categoryId}/folders/${folderName}/tts`, {
            // category: selectedCategory,
            // folder: selectedFolder,
            text: text
        })
            .then(response => {
                console.log('Conversion successful', response.data);
                // Clear text input
                setText('');
            })
            .catch(error => console.log('Error converting text', error)
             );
    };

    return (
        <div>
            <h1>Text Converter</h1>
            {/* <div>
                <label htmlFor="category-select">Category:</label>
                <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="folder-select">Folder:</label>
                <select id="folder-select" value={selectedFolder} onChange={handleFolderChange}>
                    <option value="">Select a folder</option>
                    {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                </select>
            </div> */}
            <div>
                <label htmlFor="text-input">Text:</label>
                <textarea id="text-input" value={text} onChange={handleTextChange}></textarea>
            </div>
            <button onClick={handleConvertClick}>Convert</button>
        </div>
    );
}

export default TextToSpeech;