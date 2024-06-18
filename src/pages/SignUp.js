import "./userForm.css"; 
import { useState } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle, faMeta } from '@fortawesome/free-brands-svg-icons';
import useUserRegister from "../services/useUserRegister";
import AuthResult from "../services/AuthResult";
import {HandleAuthentication} from "../components/HandleAuthentication";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

export default function SignUp() {

  const navigate = useNavigate();

  const [oauthError, setOauthError] = useState()

  const[userData, setUserData] = useState({

    email:"",
    password:"",
    username:""

  });

  const { userRegister, error } = useUserRegister();




  const handleGoogleLogin = () => {

    window.location.href = 'http://localhost:3002/auth/google';
  }

//   const handleGoogleLogin = useGoogleLogin({
//     onSuccess: (response) => {F
//         console.log("Authentication successful", response);
//         navigate("/control");
//     },
//     onError: (error) => {
//         console.error("Authentication failed", error);
//         setOauthError(error);
//     }
// });
  
const handleFacebookLogin = (response) => {
  console.log('Facebook response:', response);
  if (response.accessToken) {
      console.log("Facebook Authentication successful", response);
      navigate("/control");
  } else {
      console.error("Facebook Authentication failed", response);
  }
};
  
  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:3002/auth/github?redirect=/signup';
    AuthResult()
  };
  


  function handleFormSubmit (e){

    e.preventDefault();
    userRegister(userData);
  }

  function handleFormChange(e){

    setUserData({

      ...userData, [e.target.name]: e.target.value

    })

    
  }


  return (
    <>
      <Navbar />


      <div className="flex flex-col items-center justify-center min-h-screen animated-background">
        
        
        <div className="w-full max-w-xs px-6 py-12 md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Create your account!</h2>
        </div>


        <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <form className="space-y-7 mt-4" action="/register" method="POST" onSubmit={handleFormSubmit}>

          <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  onChange={handleFormChange}
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={handleFormChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={handleFormChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center">
                  <input
                    onChange={handleFormChange}
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border rounded-md checked:bg-indigo-600 checked:border-transparent focus:ring-indigo-500 appearance-none"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="flex justify-center">

              {error && (
                <div className="text-red-500 mt-2">

                  {error}
                    
                </div>
              )}

            </div>


            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Line with text and social buttons */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="mx-4 text-black">or continue with</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social buttons */}
          <div className="mt-6 flex justify-center mb-4">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 mr-2"
              onClick={handleGoogleLogin}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2 hover:spin-animation " />
              Google
            </button>


            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 mr-2"
              onClick={handleFacebookLogin}
            >
              <FontAwesomeIcon icon={faMeta} className="mr-2 hover:spin-animation " />
              Google
            </button>


            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800"
              onClick={handleGithubLogin}
            >
              <FontAwesomeIcon icon={faGithub} className="mr-2  hover:spin-animation" />
              GitHub
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
