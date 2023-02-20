import React from 'react'

const OurChannels = () => {
    return (
        <>
            <div className="container my-5">

                <h1 className="text-center my-5">Our Channel's</h1>
                
                <div className="container text-center">
                    <div className="row-cols-12 row" id="channels">
                        <div className="card col shadow p-4 mb-5 bg-body rounded mx-1" >
                            <img src="https://logos-world.net/wp-content/uploads/2021/09/Nickelodeon-Logo.png" className="card-img-top" alt="Nickelodeon" />
                        </div>
                        <div className="card col shadow p-4 mb-5 bg-body rounded mx-1" >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cartoon_Network_logo_%282004-2010%29.svg/1000px-Cartoon_Network_logo_%282004-2010%29.svg.png" className="card-img-top" alt="Cartoon Network" />
                        </div>
                        <div className="card col shadow p-4 mb-5 bg-body rounded mx-1" >
                            <img src="https://i.pinimg.com/originals/b3/b2/db/b3b2db5fdd1aa239645e170be3fe8d36.png" className="card-img-top" alt="Disney" />
                        </div>
                        <div className="card col shadow p-4 mb-5 bg-body rounded mx-1" >
                            <img src="https://i0.wp.com/magzoid.com/wp-content/uploads/2021/11/disney-logo-2.jpg?fit=684%2C482&ssl=1" className="card-img-top" alt="Disney" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OurChannels

