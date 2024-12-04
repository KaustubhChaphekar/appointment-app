import React, { useState } from 'react';
import { api } from '../../api/api';

const AppointmentModal = ({ event, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(event.status);
  const [error, setError] = useState('');

  const handleStatusChange = async () => {
    try {
      await api.patch(`/api/appointments/${event._id}`, { status });
      onStatusUpdate(); // Refresh appointments after update
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update appointment status. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h3 className="text-2xl font-semibold mb-4">
          Manage Appointment: {event.title}
        </h3>

        <p className="mb-2">
          <strong>Date:</strong> {new Date(event.start).toLocaleString()}
        </p>
        <p className="mb-4">
          <strong>Current Status:</strong> <span className="text-indigo-600">{event.status}</span>
        </p>

        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Update Status
        </label>
        <select
          id="status"
          className="border border-gray-300 rounded mt-2 p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Reject</option>
        </select>

        {error && (
          <p className="mt-4 text-red-600 text-sm">
            {error}
          </p>
        )}

        <div className="flex justify-end mt-6 gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleStatusChange}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
