import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';

const DeleteLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch location details.');
        }
        const data = await response.json();
        setLocation(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete location.');
      }

      toast.success('Location deleted successfully!');
      navigate('/locations');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!location) {
    return <div className="text-center mt-10">Location not found.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Delete Location</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {location.name}</p>
        <p><strong>Latitude:</strong> {location.latitude}</p>
        <p><strong>Longitude:</strong> {location.longitude}</p>
        <p><strong>Created At:</strong> {new Date(location.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(location.updatedAt).toLocaleString()}</p>
      </div>
      <button
        onClick={handleDelete}
        className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 ${
          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Location'}
      </button>
    </div>
  );
};

export default DeleteLocation; 