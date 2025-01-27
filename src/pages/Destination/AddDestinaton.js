import { X } from 'lucide-react';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Modal = ({setIsOpen, onUpdate}) => {
  const [placeData, setPlaceData] = useState({
    name: '',
    location: '',
    nearbyAttractions: '',
    bestTimeToVisit: '',
    summary: '',
    images: [],
    videos: [],
  });

  const handleInputChange = (e) => {
    setPlaceData({ ...placeData, [e.target.name]: e.target.value });
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
  };

  const handleSave = () => {
    console.log(placeData);
    // POST METHOD
    fetch('https://fourtrip-server.onrender.com/api/superadmin/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            place_name: placeData.name,
            Location: placeData.location,
            Nearby: placeData.nearbyAttractions,
            best_time: placeData.bestTimeToVisit,
            short_summary: placeData.summary,
            lattitude: 1,
            longitude: 1
            // images: placeData.images,
            // videos: placeData.videos,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message !== "Missing Information") {
            toast.success('Place added successfully');
            console.log(data);
            }
            else {
                toast.error('Missing Information');
            }
        })
        .catch((error) => {
            toast.error('Error adding place',error);
            console.error('Error:', error);
        });
  };

  const handleEdit = async (place) => {
    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/superadmin/places/${place._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place_name: placeData.name,
          location: placeData.location,
          nearby: placeData.nearbyAttractions,
          best_time: placeData.bestTimeToVisit,
          short_summary: placeData.summary,
        }),
      });

      if (!response.ok) throw new Error('Failed to update place');
      
      toast.success('Place updated successfully');
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;

    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/superadmin/places/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete place');
      
      toast.success('Place deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-black/50">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
          <div className='w-full flex items-center justify-between mb-4'>
            <h2 className="text-lg font-medium">Place to visit</h2>
            <div onClick={()=>{setIsOpen(false)}}> <X className='w-5 h-5 text-red-500 font-bold cursor-pointer' /> </div>
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
              <input
                type="text"
                id="location"
                name="location"
                value={placeData.location}
                onChange={handleInputChange}
                className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
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
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;