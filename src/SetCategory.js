import React, { useState } from 'react'
import axios from 'axios';
import CategorySelect from './CategorySelect';
const SetCategory = () => {
  
  //  route 1 : To add new category in database

  const [category, setCategory] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("http://localhost:8000/categories", { name: category })
      .then(response => {
        console.log(response.data);
        // Clear input field value
        setCategory('');
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="container text-center" id='secat'>
        <div className="container shadow-lg p-3 mb-5 bg-body rounded" id="cat">
          <div className="container">
            <div className="row text-center my-4" id="rw">
              <div className="position-relative">
                <div className="position-absolute top-0 end-0 mx-4">
                  <i className="fa-solid fa-circle-plus fa-2x" style={{ color: "#226da2" }} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  </i>
                  {/* <!-- Modal --> */}
                  <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header" id='mid_mod'>
                          <h1 className="modal-title fs-5 text-center" id="exampleModalLabel">Add a new category..</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div className="modal-body">
                            <input type="text" className="form-control" name="category" id="recipient-name" value={category} onChange={event => setCategory(event.target.value)} />
                          </div>
                          <div className="modal-footer ">
                            <button type="submit" className="btn btn-primary" >Insert</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <p>Add New Category</p>
                </div>
              </div>
              <div className="position-absolute top-0 start-0">
              </div>
              <div className="container my-3" id="in1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Indian_Space_Research_Organisation_Logo.svg/1059px-Indian_Space_Research_Organisation_Logo.svg.png" width="70px" alt="ISRO Logo" />
              </div>
              <div className="containerrrr">
                <CategorySelect />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SetCategory
