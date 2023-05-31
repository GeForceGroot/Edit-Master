import React from 'react';

const Slide = () => {
  return (
    <div className="container" id="slide">
      <div id="carouselExampleDark" className="carousel carousel-dark slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner" id='slide'>
          <div className="carousel-item active" data-bs-interval="2000">
            <img src={require('../Img/Main Edit Master.png')} width='800px' height='800px' className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Welcome</h5>
              <p>This web app is used for creating presentations using an automation process.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src={require('../Img/Upload.jpg')} width='800px' height='800px' className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Steps To Follow</h5>
              <p>You must follow all steps to create a presentation.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src={require('../Img/ThankYou.jpg')} width='800px' height='800px' className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Thank You</h5>
              <p>It's our pleasure. Have a great day.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Slide;
