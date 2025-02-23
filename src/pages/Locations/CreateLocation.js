import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const CreateLocation = () => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, latitude, longitude } = formData;
    if (!name.trim()) {
      toast.error('Name is required.');
      return false;
    }
    if (!latitude || isNaN(latitude)) {
      toast.error('Valid Latitude is required.');
      return false;
    }
    if (!longitude || isNaN(longitude)) {
      toast.error('Valid Longitude is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('/locations', formData);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to create location.');
      }

      toast.success('Location created successfully!');
      setFormData({ name: '', latitude: '', longitude: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Location</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter location name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter latitude"
            step="any"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter longitude"
            step="any"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create Location'}
        </button>
      </form>
    </div>
  );
};

export default CreateLocation;