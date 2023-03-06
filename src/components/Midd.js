import React from 'react'

const Midd = () => {
    return (
        <div className="container text-center" id="midd">
            <h1 className="text-center my-5" style={{ color: 'rgb(41, 95, 121)' }}>How It Works's...</h1>
            <div className="row" id="phone">
                <div className="card col shadow p-3 mb-5 bg-body rounded mx-4" id="col1" style={{ width: "18rem" }}>
                    <h4 style={{ color: 'rgb(41, 95, 121)' }}>Step 1</h4>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1cRM7utbjchY01WFG6vYLnH4L7yz4n67pDWtxggh20mpeyRT9-YgJ627XLl2Eaxnyl-4&usqp=CAU" width='300' height='300' className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card col shadow p-3 mb-5 bg-body rounded mx-4" id="col2" style={{ width: "18rem" }}>
                    <h4 style={{ color: 'rgb(41, 95, 121)' }}>Step 2</h4>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1j9T4jiKF34fvavZBmPrdRwutPZFNJ6gkpE8Vnp8_jebghfRXvmZzv37GhERo2TzNyxY&usqp=CAU" width='300' height='300' className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card col shadow p-3 mb-5 bg-body rounded mx-4" id="col3" style={{ width: "18rem" }}>
                    <h4 style={{ color: 'rgb(41, 95, 121)' }}>Step 3</h4>
                    <img src="data:image/png;base64,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" width='300' height='300' className="card-img-top" alt="..." />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Midd
