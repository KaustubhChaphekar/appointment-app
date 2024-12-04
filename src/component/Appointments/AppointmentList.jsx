import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const AppointmentList = ({ isAdmin }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h3 className="text-xl mb-2">{isAdmin ? 'Manage' : 'My'} Appointments</h3>
      <ul className="list-disc pl-5">
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {appointment.date} - {appointment.timeslot} ({appointment.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
