import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './component/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import AdminDashboard from './component/Dashboard/AdminDashboard';
import UserDashboard from './component/Dashboard/UserDashboard';
import ProtectedRoute from './component/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

const socket = io('http://localhost:5000');

const App = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (userId && role) {
      socket.emit('joinRoom', userId, role);
    }

    socket.on('appointmentStatusUpdate', (userId, message) => {
      toast(message, { type: 'info' });
    });

    socket.on('adminNotification', (message) => {
      toast(`Admin Notification: ${message}`, { type: 'success' });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <AuthPage /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/register" element={!user ? <AuthPage /> : <Navigate to={`/${user.role}`} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
