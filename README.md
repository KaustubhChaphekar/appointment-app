# Appointment Booking App

A full-stack appointment booking application built with **React**, **Tailwind CSS**, and a **Node.js** backend. This app allows users to book appointments through a calendar interface, while admins can manage availability and appointments. The app uses **JWT-based authentication** for secure, role-based access (admin/user).

## Features

### User Features:
- View available timeslots (10:00 AM - 1:00 PM, 2:00 PM - 6:00 PM).
- Request appointments with notifications upon confirmation.

### Admin Features:
- Block/unblock timeslots and view/manage appointments.
- Search functionality to filter appointments by date and timeslot.

### Authentication:
- Role-based access control (Admin/User) with protected routes.
- Secure login and registration using JWT.

## Technologies Used:
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, bcrypt
- **Deployment**: Backend on Railway/Render, Frontend on Vercel

## Installation

### Prerequisites
- Node.js
- MongoDB instance (or use MongoDB Atlas)

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
