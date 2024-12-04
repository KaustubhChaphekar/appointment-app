import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { api } from '../../api/api';

const AppointmentForm = ({ date, onClose, onAppointmentBooked, user }) => {
  const [timeslot, setTimeslot] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeslots = [
    '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM', '12:00 PM - 12:30 PM', '12:30 PM - 1:00 PM',
    '2:00 PM - 2:30 PM', '2:30 PM - 3:00 PM', '3:00 PM - 3:30 PM',
    '3:30 PM - 4:00 PM', '4:00 PM - 4:30 PM', '5:00 PM - 5:30 PM',
    '5:30 PM - 6:00 PM'
  ];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const response = await api.get('/api/appointments', { params: { formattedDate } });
        
        setBookedSlots(response.data.map(appointment => ({
          timeslot: appointment.timeslot,
          status: appointment.status
        })));
      } catch (error) {
        toast.error('Failed to fetch booked slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [date]);

  const availableSlots = useMemo(() => {
    return timeslots.filter(slot => {
      return !bookedSlots.some(booked => booked.timeslot === slot && booked.status === 'confirmed');
    });
  }, [timeslots, bookedSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!timeslot) {
      toast.warn('Please select a timeslot.');
      return;
    }

    try {
      await api.post('/api/appointments', {
        date,
        timeslot,
        notes,
        user,
      });
      toast.success('Appointment successfully booked!');
      onAppointmentBooked();
      onClose();
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Book Appointment for {moment(date).format('MMMM Do YYYY')}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time Slot</label>
          <select
            value={timeslot}
            onChange={(e) => setTimeslot(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            disabled={loading || availableSlots.length === 0}
          >
            <option value="" disabled>Select a timeslot</option>
            {loading ? (
              <option>Loading available slots...</option>
            ) : availableSlots.length === 0 ? (
              <option>No available slots</option>
            ) : (
              availableSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any message for the appointment..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 resize-none"
            rows="4"
          />
        </div>
        <div className="flex justify-between items-center">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
