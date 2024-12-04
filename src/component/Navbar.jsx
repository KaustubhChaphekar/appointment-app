import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Successfully logged out!');
    setTimeout(() => {
      logout();
      navigate('/');
      window.scrollTo(0, 0);
    }, 2000);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-800 shadow-lg">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <nav className=" mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-white">
          <Link to="/" className="hover:text-gray-200" aria-label="Home">
            AppointmentApp
          </Link>
        </h1>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/user'}
                className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-200"
                aria-label="Dashboard"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
                aria-label="Login"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-all duration-200"
                aria-label="Register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
