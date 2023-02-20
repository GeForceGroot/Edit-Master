import React from 'react'

const Mid = () => {
  return (
 <>
  <h1 className="text-center my-4">This is our mid element</h1>
  <div className="container text-center ">
        
  <div className="row" >
    <div className="col mx-3 shadow-sm p-3 mb-5 bg-body rounded"  id="col1">
    <div className="has-bg-img bg-purple bg-blend-multiply">
  <h4 className="text-center">Electric Type</h4>
  <img className="container text-center bg-img" src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-blue-version/8/89/Pikachu.jpg" alt="..."/>
</div>
    </div>
    <div className="col mx-3 shadow-sm p-3 mb-5 bg-body rounded" id="col2">
    <div className="has-bg-img bg-purple bg-blend-multiply">
  <h4 className="text-center">Ground Type</h4>
  <img className="container text-center bg-img" src="https://i.pinimg.com/originals/be/9e/75/be9e7515501bf291918ed4afcfe4294b.jpg" alt="..."/>
</div>
    </div>
    <div className="col mx-3 shadow-sm p-3 mb-5 bg-body rounded" id="col3">
    <div className="has-bg-img bg-purple bg-blend-multiply">
  <h4 className="text-center">Water Type</h4>
  <img className="container text-center bg-img" src="https://i.pinimg.com/originals/8b/23/fc/8b23fc2ada541b8605ed76a1f79c24c2.png" alt="..."/>
</div>
    </div>
  </div>
</div>
 </>

  
  )
}

export default Mid
