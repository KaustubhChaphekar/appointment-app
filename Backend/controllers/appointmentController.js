import Appointment from '../models/Appointment.js';
import moment from 'moment';
import { notifyAdmins, notifyUser } from '../server.js'; // Import both notifyAdmins and notifyUser functions

// Function to create an appointment
const createAppointment = async (req, res) => {
  const { date, timeslot, notes } = req.body;

  // Validate that the appointment date is in the future
  if (new Date(date) <= new Date()) {
    return res.status(400).json({ error: 'The appointment date must be in the future.' });
  }

  // Check if notes are empty or just whitespace
  if (!notes || notes.trim() === '') {
    return res.status(400).json({ error: 'Notes are required and cannot be empty.' });
  }

  try {
    // Check if the timeslot is already booked for the given date
    const existingAppointment = await Appointment.findOne({
      date,
      timeslot: { $regex: `^${timeslot}` },
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'The selected timeslot is already booked.' });
    }

    // Create a new appointment
    const appointment = new Appointment({
      user: req.user.id,
      date,
      timeslot,
      notes,
    });

    // Notify admins about the new appointment request
    notifyAdmins(`New appointment request on ${date} at ${timeslot}`);

    // Save the appointment to the database
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: err.message });
  }
};


// Function to get all appointments

const getAppointments = async (req, res) => {
  const { date } = req.query;

  try {
    let query = req.user.role === 'admin' ? {} : { user: req.user.id };

    if (date) {
      const startOfDay = moment(date).startOf('day').toDate();
      const endOfDay = moment(date).endOf('day').toDate();

      query = {
        ...query,
        start: { $gte: startOfDay },
        end: { $lte: endOfDay },
      };
    }

    const appointments = await Appointment.find(query).populate('user', 'name email');

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};




// Function to update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { status, timeslot, notes } = req.body;

  try {
    // Find the appointment by its ID
    const appointment = await Appointment.findById(id).populate('user', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Admin-only permission to confirm appointments
    if (status === 'confirmed' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can confirm appointments' });
    }

    // Update appointment fields
    if (status) appointment.status = status;
    if (timeslot) appointment.timeslot = timeslot;
    if (notes) appointment.notes = notes;

    // Save the updated appointment
    await appointment.save();

    // Send a real-time notification to the user about the updated appointment status
    const message = `Your appointment on ${moment(appointment.date).format('MMMM Do YYYY')} at ${appointment.timeslot} has been ${status}.`;
    notifyUser(appointment.user._id.toString(), message); // Assuming this sends a message to the user

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createAppointment, getAppointments, updateAppointment };
