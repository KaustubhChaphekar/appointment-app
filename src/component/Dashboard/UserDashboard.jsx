import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { api } from '../../api/api';
import { io } from 'socket.io-client';
import AppointmentForm from '../Appointments/AppointmentForm';
import { AiOutlineClose } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const UserDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch appointments on mount and listen for status updates via WebSocket
  useEffect(() => {
    fetchAppointments();
    const socket = io(import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

    socket.on('appointmentStatusUpdate', (message) => {
      toast.success(message);
      fetchAppointments(); // Re-fetch appointments after status update
    });

    socket.on('connect_error', () => {
      toast.error('WebSocket connection failed.');
    });

    return () => {
      socket.disconnect(); // Clean up the socket on component unmount
    };
  }, [user]);

  // Function to fetch appointments from the API
  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments');
      setAppointments(
        data.map((appointment) => {
          const startTime = moment(appointment.date)
            .format('YYYY-MM-DD') + ' ' + appointment.timeslot.split('-')[0];
          const endTime = moment(appointment.date)
            .format('YYYY-MM-DD') + ' ' + appointment.timeslot.split('-')[1];

          return {
            title: `${appointment.timeslot} - ${appointment.status}`,
            start: new Date(startTime),
            end: new Date(endTime),
            status: appointment.status,
            notes: appointment.notes,
            ...appointment,
          };
        })
      );
    } catch (error) {
      toast.error('Failed to load appointments. Please try again.');
      console.error('Error fetching appointments:', error);
    }
  };

  // Handle selecting a time slot on the calendar
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  // Callback when appointment is booked, re-fetch appointments
  const handleAppointmentBooked = () => {
    setShowModal(false);
    fetchAppointments(); // Re-fetch appointments after a new one is booked
    onClose();
  };

  // Style events based on status
  const eventStyleGetter = (event) => {
    let backgroundColor;

    if (event.status === 'confirmed') {
      backgroundColor = '#34D399'; // Green for confirmed
    } else if (event.status === 'rejected') {
      backgroundColor = '#EF4444'; // Red for rejected
    } else if (event.status === 'pending') {
      backgroundColor = '#FBBF24'; // Yellow for pending
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        color: '#fff',
        borderRadius: '0px',
        opacity: 0.8,
        border: 'none',
      },
    };
  };

  return (
    <div className=" my-6  bg-slate-100  p-6">
      <div className="mb-4 ">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <div className="mb-4">
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh' }}
            selectable
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventStyleGetter}
          />
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowModal(false)}
              >
                <AiOutlineClose size={24} />
              </button>

              <AppointmentForm
                date={selectedDate}
                user={{ name: 'Test User' }}
                bookedSlots={appointments.filter((appt) =>
                  moment(appt.start).isSame(selectedDate, 'day')
                )}
                onClose={() => setShowModal(false)}
                onAppointmentBooked={handleAppointmentBooked}
              />
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default UserDashboard;
