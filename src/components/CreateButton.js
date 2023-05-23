import React from 'react'
import { useHistory } from "react-router-dom";

 
const CreateButton = () => {
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/setCategory`; 
    history.push(path);
  }

  return (
    <div className="contanier">
    <div className="text-center my-5">
      <button type="button" className="btn btn-primary btn-lg" id='createbtn' onClick={routeChange}>Create Now</button>
    </div>
    </div>
  )
}

export default CreateButton
