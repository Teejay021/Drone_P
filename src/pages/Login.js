import "./userForm.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle, faMeta } from '@fortawesome/free-brands-svg-icons';
import useUserLogin from "../services/useUserLogin";


export default function Login() {

  const[userData, setUserData] = useState({
    email:"",
    password:"",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const userLogin = useUserLogin();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleOauthLogin = (provider) => {
    window.location.href = `http://localhost:3002/auth/${provider}`;
  };  

  async function handleFormSubmit (e){
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      const result = await userLogin(userData);
      if (result.success) {
        // Login successful - show success message and redirect
        console.log("Login successful:", result.user);
        setSuccessMessage("Login successful! Redirecting...");
        
        // Redirect to the page they were trying to access, or to home
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormChange(e){
    setUserData({
      ...userData, [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  }


  return (


    <>
      <Navbar />


      <div className="flex flex-col items-center justify-center min-h-screen animated-background">
        
        
        <div className="w-full max-w-xs px-6 py-12 md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Welcome Back!</h2>
        </div>


        <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <form className="space-y-7 mt-4" action="#" method="POST" onSubmit={handleFormSubmit}>
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log in"}
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
              onClick={() => handleOauthLogin("google")}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2 hover:spin-animation " />
              Google
            </button>

            <button
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-2"
              onClick={() => handleOauthLogin("facebook")}
            >
              <FontAwesomeIcon icon={faMeta} className="mr-2 hover:spin-animation" />
              Meta
            </button>
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800"
              onClick={() => handleOauthLogin("github")}
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
