import React from 'react';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white">
    <h1 className="text-4xl font-bold text-center mt-10 mb-4">
      Welcome to the Appointment Booking App
    </h1>
    <p className="text-xl mb-6 text-center max-w-lg">
      Easily book your appointments, manage your schedule, and stay up-to-date with notifications.
    </p>
    <div className="flex justify-center space-x-4">
      <a
        href="/login"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
      >
        Login
      </a>
      <a
        href="/register"
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none"
      >
        Register
      </a>
    </div>
    <footer className="mt-10 text-sm text-center bottom-3">
      <p>&copy; 2024 Appointment Booking App. All Rights Reserved.</p>
    </footer>
  </div>
);

export default Home;
