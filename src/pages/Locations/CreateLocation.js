import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const CreateLocation = () => {
  const [formData, setFormData] = useState({
    name: '',
    map_url: '',
    iframe_url: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, map_url, iframe_url } = formData;
    if (!name.trim()) {
      toast.error('Name is required.');
      return false;
    }
    if (!map_url || isNaN(map_url)) {
      toast.error('Valid map_url is required.');
      return false;
    }
    if (!iframe_url || isNaN(iframe_url)) {
      toast.error('Valid iframe_url is required.');
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
      setFormData({ name: '', map_url: '', iframe_url: '' });
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
          <label className="block text-gray-700">Map Url</label>
          <input
            type="number"
            name="map_url"
            value={formData.map_url}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter Map Url"
            step="any"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Iframe Url </label>
          <input
            type="number"
            name="iframe_url"
            value={formData.iframe_url}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter Iframe Url"
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