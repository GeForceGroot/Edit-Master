import React from 'react'

const SetCategory = () => {
  return (
    <>
      <div className="container shadow-lg p-3 mb-5 bg-body rounded" id="cat">
        <div className="container">

          <div className="row text-center my-4" id="rw">
            <div class="position-relative">
              <div class="position-absolute top-0 end-0 mx-4">
                <i class="fa-solid fa-circle-plus fa-2x" style={{ color: "#226da2" }} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                </i>
                {/* <!-- Modal --> */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header" id='mid_mod'>
                        <h1 class="modal-title fs-5 text-center" id="exampleModalLabel">Add a new category..</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <input type="text" class="form-control" id="recipient-name" />
                      </div>
                      <div class="modal-footer ">
                        <button type="button" class="btn btn-primary">Insert</button>
                      </div>
                    </div>
                  </div>
                </div>
                <p>Add New Category</p>
              </div>
            </div>
            <div class="position-absolute top-0 start-0">
            </div>
            <div className="container my-3" id="in1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/1059px-Indian_Space_Research_Organisation_Logo.svg.png" width="70px" alt="ISRO Logo" />
            </div>
            <div className="container" id="in2">
              <div className="row">
                <div className="col text-end " id="gory1">
                  <i class="fa fa-list-alt fa-2x" aria-hidden="true"></i>
                </div>
                <div className="col text-start" style={{ fontSize: "1.3rem" }} id='eg'>
                  <b>
                    Select Category
                  </b>
                </div>
              </div>
              <div className="container text-center  my-3">
                <select class="form-select " aria-label="Default select example" id='menu'>
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="container" id="in3">
              <div className="row" id="btn_cat">
                <div className="col text-end " id='gory2'>
                  <i class="fa-regular fa-file fa-2x" id="btn_cat"></i>
                </div>
                <div className="col text-start" style={{ fontSize: "1.3rem" }} id='eg1'>
                  <b>
                    Enter Your File Name
                  </b>
                </div>
              </div>
              <div className="container text-center  my-3">
                <input type="text" id="file_name" name="filename" form="Form1" autocomplete="off" />
              </div>
            </div>

          </div>
          <div class="position-relative my-4">
            <div class="position-absolute bottom-0 end-0 my-4 mx-4">
              <button type="button" class="btn btn-primary mx-4" id="cat_button">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SetCategory
