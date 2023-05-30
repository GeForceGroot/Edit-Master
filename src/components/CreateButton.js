import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const CreateButton = () => {
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  const routeChange = () => {
    setProgress(0); // Reset progress to start from 0
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 40) {
          clearInterval(timer);
          return 100;
        } else {
          return prevProgress + 1;
        }
      });
    }, 100);
    
    let path = `/setCategory`;
    setTimeout(() => {
      history.push(path);
    }, 1500);
  };

  return (
    <div className="container">
      <div className="text-center my-5">
        <button type="button" className="btn btn-primary btn-lg" id="createbtn" onClick={routeChange}>
          Create Now
        </button>
      </div>
      <LoadingBar progress={progress} height={3} color="#ff6b6b" />
    </div>
  );
};

export default CreateButton;
