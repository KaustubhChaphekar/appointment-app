// backend/models/Appointment.js
import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, validate: [dateValidator, 'Appointment must be in the future'] },
  timeslot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  notes: { type: String,  required: [true, 'Notes are required'], },
});

function dateValidator(value) {
  return value > new Date(); // Date must be in the future
}

export default model('Appointment', appointmentSchema);
