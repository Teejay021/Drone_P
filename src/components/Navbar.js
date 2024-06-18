import { useState, useRef, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DefaultPfp from "../images/user.png";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../store/index";

function Navbar() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const username = useSelector((state) => state.user?.username ?? '');
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn ?? false);

  const divEl = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      if (divEl.current && !divEl.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler, true);
    };
  }, []);

  const mobileNavBar = (
    <div className="flex flex-col items-start justify-start text-blue-gray-900">
      <Link to="/" className="py-2 px-4 block text-sm">Home</Link>
      <Link to="/contact" className="py-2 px-4 block text-sm">Contact</Link>
      <Link to="#" className="py-2 px-4 block text-sm">Docs</Link>
      <Link to="#" className="py-2 px-4 block text-sm">Gallery</Link>
    </div>
  );

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function handleLogout() {
    dispatch(logout());
    window.location.href = 'http://localhost:3002/logout';
  }

  function handleProfileClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <>
      <nav className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-white border dark:bg-black rounded-none shadow-md h-max border-white/80 dark:border-black/90 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link to="/" className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased dark:text-white">
            Duplicate House
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden mr-4 lg:block">
              <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 dark:text-white">
                  <Link to="/" className="flex items-center hover-underline">Home</Link>
                </li>
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 dark:text-white">
                  <Link to="/contact" className="flex items-center hover-underline">Contact</Link>
                </li>
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 dark:text-white">
                  <Link to="#" className="flex items-center hover-underline">Docs</Link>
                </li>
                <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 dark:text-white">
                  <Link to="/gallery" className="flex items-center hover-underline">Gallery</Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-x-1">
              <DarkModeToggle />
            </div>
            <div>
              <img
                onClick={handleProfileClick}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src={DefaultPfp}
                alt="Profile"
              />
              {isDropdownOpen && (
                <div className="absolute right-1 z-10 mt-2 w-48 py-1 bg-white shadow-lg dark:bg-black dark:border rounded-md">
                  <div className="flex items-center p-2">
                    <img
                      onClick={handleProfileClick}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white mr-3"
                      src={DefaultPfp}
                      alt="Profile"
                    />
                    {isLoggedIn && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{username}</h3>
                      </div>
                    )}
                  </div>
                  <hr className="my-1 dark:border-gray-700" />
                  {!isLoggedIn ? (
                    <>
                      <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">Sign up</Link>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">Log in</Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      Log out
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              ref={divEl}
              onClick={handleClick}
              className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="flex flex-col items-start justify-start text-blue-gray-900 lg:hidden">
            <Link to="/" className="py-2 block text-sm dark:text-white">Home</Link>
            <Link to="/contact" className="py-2 block text-sm dark:text-white">Contact</Link>
            <Link to="#" className="py-2 block text-sm dark:text-white">Docs</Link>
            <Link to="/gallery" className="py-2 block text-sm dark:text-white">Gallery</Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
