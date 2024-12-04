import React, { useState, useContext } from 'react';
import { api } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InputField = ({ id, label, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm font-medium mb-2" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
      required={required}
    />
  </div>
);

const SubmitButton = ({ loading, text }) => (
  <button
    type="submit"
    className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-500 transition-all ${
      loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={loading}
  >
    {loading ? 'Please Wait...' : text}
  </button>
);

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info('Logging in... Please wait.');
    setTimeout(async () => {
      try {
        const res = await api.post('/api/auth/login', loginData);
        if (res?.data?.token && res?.data?.user) {
          await login(res.data);
          toast.success('Login successful!');
          setTimeout(() => navigate(res.data.user.role === 'admin' ? '/admin' : '/user'), 1000);
        } else {
          throw new Error('Unexpected server response');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info('Registering... Please wait.');
    setTimeout(async () => {
      try {
        await api.post('/api/auth/register', registerData);
        toast.success('Registration successful!');
        setTimeout(() => navigate(registerData.role === 'admin' ? '/admin' : '/user'), 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed!');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg transition-all duration-500 hover:scale-105">
        <div className="flex justify-center space-x-8 mb-8">
          <button
            className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('login')}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('register')}
            disabled={loading}
          >
            Register
          </button>
        </div>
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <InputField
              id="login-email"
              label="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              type="email"
              required
            />
            <InputField
              id="login-password"
              label="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              type="password"
              required
            />
            <SubmitButton loading={loading} text="Login" />
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <InputField
              id="register-name"
              label="Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <InputField
              id="register-email"
              label="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              type="email"
              required
            />
            <InputField
              id="register-password"
              label="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              type="password"
              required
            />
            <SubmitButton loading={loading} text="Register" />
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
