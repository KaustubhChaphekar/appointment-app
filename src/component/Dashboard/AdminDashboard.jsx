import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { api } from '../../api/api';
import AppointmentModal from '../Appointments/AppointmentModal';
import AppointmentForm from '../Appointments/AppointmentForm';
import { io } from 'socket.io-client';
import { AiOutlineClose } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAppointments();

    const socket = io(import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

    socket.on('appointmentStatusUpdate', (message) => {
      toast.success(message);
      fetchAppointments();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchTerm, appointments]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments');
      const formattedData = data.map((appointment) => ({
        title: `${appointment.user.name} (${appointment.status})`,
        start: new Date( moment(appointment.date).format('YYYY-MM-DD') + ' ' + appointment.timeslot.split('-')[0]),
        end: new Date(moment(appointment.date).format('YYYY-MM-DD') + ' ' + appointment.timeslot.split('-')[1]),
        allDay: false,
        ...appointment,
      }));
      setAppointments(formattedData);
      setFilteredAppointments(formattedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleAdminBooking = () => {
    setShowForm(true);
  };

  const handleAppointmentBooked = () => {
    setShowForm(false);
    fetchAppointments();
  };

  const handleSearch = () => {
    const filtered = appointments.filter((appointment) =>
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const handleSelectDate = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowForm(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
  
    // Assign background color based on the event status
    if (event.status === 'confirmed') {
      backgroundColor = '#34D399'; // Green for confirmed
    } else if (event.status === 'rejected') {
      backgroundColor = '#EF4444'; // Red for rejected
    } else if (event.status === 'pending') {
      backgroundColor = '#FBBF24'; // Yellow for pending
    }
  
    // Return the style object with the correct background color
    let style = {
      backgroundColor: backgroundColor,
      color: '#fff',
      borderRadius: '0px',
      opacity: 0.8,
      border: 'none',
    };
  
    return {
      style: style,
    };
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAdminBooking}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Book Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <Calendar
          localizer={localizer}
          events={filteredAppointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          selectable
          onSelectSlot={handleSelectDate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {selectedEvent && (
        <AppointmentModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onStatusUpdate={fetchAppointments}
        />
      )}

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate__animated animate__fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <AppointmentForm
              date={selectedDate || new Date()}
              onClose={() => setShowForm(false)}
              onAppointmentBooked={handleAppointmentBooked}
              user={{ name: 'Admin', role: 'admin' }}
            />
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AdminDashboard;
