import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';

const Modal = ({setIsOpen, onUpdate, editingPlace}) => {
  const [placeData, setPlaceData] = useState({
    name: editingPlace?.place_name || '',
    location: editingPlace?.Location || '',
    nearbyAttractions: editingPlace?.Nearby || '',
    bestTimeToVisit: editingPlace?.best_time || '',
    summary: editingPlace?.short_summary || '',
    images: [],
    videos: [],
  });

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Fetch locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        toast.error('Error loading locations');
        console.error('Error:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceData({ ...placeData, [name]: value });

    // When location is selected, update selectedLocation
    if (name === 'location') {
      const location = locations.find(loc => loc._id === value);
      setSelectedLocation(location);
    }
  };

  const handleImageUpload = (e) => {
    setPlaceData({ ...placeData, images: [...placeData.images, e.target.files[0]] });
  };

  const handleVideoUpload = (e) => {
    setPlaceData({ ...placeData, videos: [...placeData.videos, e.target.files[0]] });
  };

  const handleClear = () => {
    setPlaceData({
      name: '',
      location: '',
      nearbyAttractions: '',
      bestTimeToVisit: '',
      summary: '',
      images: [],
      videos: [],
    });
    setSelectedLocation(null);
  };

  const handleSave = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    const latitude = selectedLocation.latitude?.$numberDecimal || selectedLocation.latitude;
    const longitude = selectedLocation.longitude?.$numberDecimal || selectedLocation.longitude;

    const url = editingPlace 
      ? `https://fourtrip-server.onrender.com/api/superadmin/places/${editingPlace._id}`
      : 'https://fourtrip-server.onrender.com/api/superadmin/places';

    const method = editingPlace ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place_name: placeData.name,
          Location: selectedLocation.name,
          Nearby: placeData.nearbyAttractions,
          best_time: placeData.bestTimeToVisit,
          short_summary: placeData.summary,
          lattitude: latitude,
          longitude: longitude
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(editingPlace ? 'Place updated successfully' : 'Place added successfully');
        setIsOpen(false);
        if (onUpdate) onUpdate();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error saving place');
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-black/50">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
          <div className='w-full flex items-center justify-between mb-4'>
            <h2 className="text-lg font-medium">
              {editingPlace ? 'Edit Place' : 'Add New Place'}
            </h2>
            <div onClick={()=>{setIsOpen(false)}}> 
              <X className='w-5 h-5 text-red-500 font-bold cursor-pointer' /> 
            </div>
          </div>

          <div className='flex gap-4'>
            <div className="mb-4 flex flex-col flex-1">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Place Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={placeData.name}
                onChange={handleInputChange}
                className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>

            <div className="mb-4 flex flex-col flex-1">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              {isLoadingLocations ? (
                <div className="border rounded-md px-3 py-2 bg-gray-100">Loading locations...</div>
              ) : (
                <select
                  id="location"
                  name="location"
                  value={placeData.location}
                  onChange={handleInputChange}
                  className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className='flex gap-4 w-full'>
            <div className="flex flex-col flex-1 mb-4">
              <label htmlFor="nearbyAttractions" className="block text-gray-700 font-medium mb-2">
                Nearby Attractions
              </label>
              <input
                id="nearbyAttractions"
                name="nearbyAttractions"
                value={placeData.nearbyAttractions}
                onChange={handleInputChange}
                className="flex flex-1 border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>

            <div className="flex flex-col flex-1 mb-4">
              <label htmlFor="bestTimeToVisit" className="block text-gray-700 font-medium mb-2">
                Best Time to Visit
              </label>
              <input
                type="text"
                id="bestTimeToVisit"
                name="bestTimeToVisit"
                value={placeData.bestTimeToVisit}
                onChange={handleInputChange}
                className="flex flex-1 border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">
              Short summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={placeData.summary}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Add Images</label>
            <input type="file" multiple onChange={handleImageUpload} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Add Videos</label>
            <input type="file" multiple onChange={handleVideoUpload} />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClear}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="bg-[#E27D60] text-white font-medium py-2 px-4 rounded"
            >
              {editingPlace ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;