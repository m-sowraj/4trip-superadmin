import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const ViewLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`/locations/${id}`);
        setLocation(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const getDecimalValue = (value) => {
    if (value && value.$numberDecimal) {
      return value.$numberDecimal;
    }
    return value;
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!location) {
    return <div className="text-center mt-10">Location not found.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Location Details</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {location.name}</p>
        <p><strong>Latitude:</strong> {getDecimalValue(location.latitude)}</p>
        <p><strong>Longitude:</strong> {getDecimalValue(location.longitude)}</p>
        <p><strong>Created At:</strong> {new Date(location.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(location.updatedAt).toLocaleString()}</p>
      </div>
      <button
        onClick={() => navigate('/locations')}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Back to Locations
      </button>
    </div>
  );
};

export default ViewLocation;