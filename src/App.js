import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import CursorAnimation from './components/CursorAnimation';
import Control from './pages/Control';

function App (){

  

  

  return (<>

    <CursorAnimation />

    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/control" element ={<Control />} />
        
      </Routes>

      
    </Router>
    




        
  </>);
}

export default App;