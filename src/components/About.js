import React from 'react'

const About = () => {
    return (
        <div className="containertext-center" >
            <div className="container text-center">

                <img className="my-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/1059px-Indian_Space_Research_Organisation_Logo.svg.png" width="350px" height="300px" alt="" />
            </div>
            <div className="container my-2" >
                <h1 className='text-center' id="ut" style={{ fontSize: "3rem",textDecoration: "underline",color: "inherit" }}>About Us</h1>
                <div className="container text-center my-5">

                    <p className="my-5" style={{ fontSize: "1.8rem", overflowWrap: "break-word" }}>National Remote Sensing Centre (NRSC) has the mandate for establishment of ground stations for receiving satellite data, generation of data products, dissemination to the users, development of techniques for remote sensing applications including disaster management support, geospatial services for good governance and capacity building for professionals, faculty and students.</p>
                </div>
                <h1 className='text-center' style={{ fontSize: "3rem",textDecoration: "underline",color: "inherit"  }}>Contact Us</h1>
                <div className="container text-center my-5">
                <i className="fa-regular fa-address-book fa-3x">
                        <p className="my-5"style={{ fontSize: "1.8rem" }}>+91 (40) 2388 4422 / 23 </p>
                        </i>       
                </div>
            </div>

        </div>

    )
}

export default About
