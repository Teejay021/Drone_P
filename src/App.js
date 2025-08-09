import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Login from './pages/Login';
import Home from './pages/Home';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import Control from './pages/Control';
import Setting from './pages/Setting';
import { login, logout } from './store'; // Ensure correct import path

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:3002/auth/login/success", { withCredentials: true });

        if (response.status === 200 && response.data.user) {
          console.log(response.data.user);
          dispatch(login({

            username: response.data.user.displayName,
            image: response.data.user.image

          }));
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/setting" element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        } />
        <Route path="/control" element={
          <ProtectedRoute>
            <Control />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
