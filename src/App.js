import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './pages/Login';
import Home from './pages/Home';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import Control from './pages/Control';
import { login, logout } from './store/index';

function App() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user?.username ?? '');
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn ?? false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:3002/auth/google/success", { withCredentials: true });

        if (response.status === 200 && response.data.user) {
          console.log("SALAM HABIBIB");
          dispatch(login(response.data.user.username));
        } else {
          dispatch(logout());
          throw new Error("Authentication has failed");
        }
      } catch (err) {
        console.log(err);
        dispatch(logout()); // Ensure logout is called on error
      }
    };

    getUser();
  }, [dispatch]);

  console.log(username);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/control" element={isLoggedIn ? <Control /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
