import React from 'react'

const OurChannels = () => {
    return (
        <>
            <div className="container my-5">

                <h1 className="text-center my-5" id='ourChan' style={{ color: 'rgb(71, 102, 174)',textDecoration: 'underline' }}>Our Centers</h1>
                
                <div className="container text-center">
                    <div className="row-cols-12 row" id="channels">
                        <div className="card col  p-4 mb-5 bg-body rounded mx-1" id='chan1' >
                            <img src="https://www.sac.gov.in/Vyom/images/SAC_C.JPG" className="card-img-top" alt="SAC ISRO" />
                            <a target='_blank' href='https://www.isro.gov.in/SAC.html' rel="noopener noreferrer" id='sac'>
                           <h5>Space Applications Centre (SAC)</h5>
                            </a>
                        </div>
                        <div className="card col  p-4 mb-5 bg-body rounded mx-1" id='chan2'>
                            <img src="https://www.isro.gov.in/media_isro/image/centreimages/ursc.jpg.webp" className="card-img-top" alt="URSC ISRO" />
                            <a target='_blank' href='https://www.ursc.gov.in/' rel="noopener noreferrer" id='sac1'>
                           <h5>U R Rao Satellite Centre (URSC)</h5>
                           </a>
                        </div>
                        <div className="card col  p-4 mb-5 bg-body rounded mx-1" id='chan3'>
                            <img src="https://www.isro.gov.in/media_isro/image/centreimages/nrsc.jpg.webp" className="card-img-top" alt="NRSC ISRO" />
                            <a target='_blank' href='https://www.nrsc.gov.in/' rel="noopener noreferrer" id='sac2'>

                           <h5>National Remote Sensing Centre (NRSC)</h5>
                  </a>
                        </div>
                        <div className="card col  p-4 mb-5 bg-body rounded mx-1" id='chan4'>
                            <img src="https://www.vssc.gov.in/photgallery/GSLV_F10/2_large.jpg" className="card-img-top" alt="SDSC" />
                            <a target='_blank' href='https://www.shar.gov.in/sdscshar/newAboutus.jsp' rel="noopener noreferrer" id='sac3'>

                           <h5>Satish Dhawan Space Centre (SDSC)</h5>
                  </a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OurChannels

