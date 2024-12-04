import React, { useState, useContext } from 'react';
import { api } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' }); // Reset alert before login attempt

    try {
      const res = await api.post('/api/auth/login', credentials);
      
      if (res?.data?.token && res?.data?.user) {
        await login(res.data);
        setAlert({ type: 'success', message: 'Login successful!' });

        setTimeout(() => {
          navigate(res.data.user.role === 'admin' ? '/admin' : '/user');
        }, 1000);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAlert({ type: 'error', message: errorMessage });
      console.error('Error during login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" >
      <form
        onSubmit={handleSubmit}
        className="bg-white  p-8 shadow-lg rounded-lg w-full max-w-md transform transition-all duration-300 hover:scale-105"
      >
        <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600 animate__animated animate__fadeIn">Login</h3>

        {alert.message && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg transition-opacity duration-500 ease-in-out ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-500 opacity-100'
                : 'bg-red-100 text-red-700 border border-red-500 opacity-100'
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white bg-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
