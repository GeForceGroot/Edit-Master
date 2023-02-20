import './App.css';
import About from './components/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetCategory from './SetCategory';
// import InsertPopUp from './InsertPopUp';



function App() {
  return (
    <>
      <Router>
        <Navbar />
        {/* <InsertPopUp/> */}
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/about'>
            <About />
          </Route>
          <Route exact path='/setCategory'>
            <SetCategory />
          </Route>
        </Switch>
        <Footer />
      </Router>

    </>
  );
}

export default App;
