import './App.css';
import About from './components/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetCategory from './SetCategory';
import UploadImage from './UploadImage';
import TextToSpeech from './TextToSpeech';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <ToastContainer />
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
          <Route exact path='/uploadImage'>
            <UploadImage/>
          </Route>
          <Route exact path='/TextToSpeech'>
          <TextToSpeech/>
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
