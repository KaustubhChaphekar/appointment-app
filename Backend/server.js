import express, { json } from 'express';
import http from 'http';
import connectToMongo from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIoServer } from 'socket.io';
import Appointment from './models/Appointment.js'; // Ensure the model is imported correctly
import { body, validationResult } from 'express-validator';

dotenv.config();

// Initialize express and server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIoServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Server-side: notifyAdmins and notifyUser functions
export const notifyAdmins = (message) => {
  if (!message) {
    console.error('Notification message is required');
    return;
  }
  io.to('admins').emit('adminNotification', message);
};

export const notifyUser = (userId, message) => {
  if (!userId || !message) {
    console.error('User ID and message are required');
    return;
  }
  io.to(userId).emit('appointmentStatusUpdate', message);
};



// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  socket.on('joinRoom', (userId, role) => {
    if (!userId || !role) {
      console.error('joinRoom event requires userId and role');
      return;
    }
    console.log(`User with ID ${userId} joined room ${role}`);
    socket.join(userId);
    if (role === 'admin') {
      socket.join('admins'); // Admins join a common room
    }
    console.log(`User with ID ${userId} joined room ${role}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Route to update appointment status and notify user
app.post(
  '/appointments/:id/status',
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { id } = req.params;

    try {
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.status = status;
      await appointment.save();

      // Notify the user about the status update
      notifyUser(appointment.user.toString(), `Your appointment has been ${status}`);

      res.status(200).json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Error updating appointment' });
    }
  }
);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
