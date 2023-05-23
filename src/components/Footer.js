import React from 'react'

const Footer = () => {
  return (

    <div className='Footer' style={{ position: 'relative',height:'100%'}}>
      <footer className="text-center text-white " style={{ backgroundColor: "#f1f1f1" }}>
        {/* <!-- Grid container --> */}
        <div className="container pt-4">
          {/* <!-- Section: Social media --> */}
          <section className="mb-4">
            {/* <!-- Facebook --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#3b5998" }}
              href="https://www.facebook.com/ISRO/"
              role="button"
              target='_'
              id='tiFoot'
            ><i className="fab fa-facebook-f"></i>
            </a>
            {/* <!-- Twitter --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#55acee" }}
              href="https://twitter.com/isro?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
              role="button"
              target='_'
              id='fbFoot'
            ><i className="fab fa-twitter"></i>
            </a>

            {/* <!-- Google --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#dd4b39" }}
              href="https://www.isro.gov.in/"
              role="button"
              target='_'
              id='gFoot'
            ><i className="fab fa-google"></i>
            </a>

            {/* <!-- Instagram --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#ac2bac" }}
              href="https://www.instagram.com/isro.in/?hl=en"
              role="button"
              target='_'
              id='iFoot'
            ><i className="fab fa-instagram"></i>
            </a>

            {/* <!-- Linkedin --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#0082ca" }}
              href="https://www.linkedin.com/in/shreyansh-tiwari-0160bb209/"
              role="button"
              target='_'
              id='lFoot'
            ><i className="fab fa-linkedin-in"></i>
            </a>
            {/* <!-- Github --> */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: "#333333" }}
              href="https://github.com/GeForceGroot"
              role="button"
              target='_'
              id='gitFoot'
            ><i className="fab fa-github"></i>
            </a>
          </section>
          {/* <!-- Section: Social media --> */}
        </div>
        {/* <!-- Grid container --> */}

        {/* <!-- Copyright --> */}
        <div className="text-center text-dark p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
          © 2023 Copyright :
          <a className="text-dark" href="https://mdbootstrap.com/"> Khushal Chandak & GeForceGroot</a>
        </div>
        {/* <!-- Copyright --> */}
      </footer>
    </div>
  )
}

export default Footer
