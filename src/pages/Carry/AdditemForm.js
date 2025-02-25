import { Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';
import axiosInstance from "../../utils/axios";

const AddItemForm = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static items list
  const staticItems = [
    'Bag', 'Water Bottle', 'First Aid Kit', 'Flashlight', 
    'Snacks', 'Camera', 'Power Bank', 'Umbrella',
    'Sunscreen', 'Hat', 'Walking Shoes', 'Map'
  ];

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get("/locations");
        setLocations(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchLocations();
  }, []);

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === staticItems.length ? [] : [...staticItems]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation || selectedItems.length === 0) {
      toast.error('Please select a location and at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit each selected item for the location
      await Promise.all(selectedItems.map(item => 
        axiosInstance.post("/superadmin/thingstocarry", {
          name: item,
          location_id: selectedLocation
        })
      ));

      toast.success('Items added successfully');
      setSelectedItems([]);
      setSelectedLocation('');
    } catch (error) {
      toast.error('Failed to add items');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Add Things to Carry</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="px-6 flex-1 overflow-auto">
          <div className="space-y-4">
            <div className="sticky top-0 bg-white pt-2 pb-4 z-10">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Select Location
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sticky top-[100px] bg-white py-2 z-10 flex items-center justify-between">
              <label className="text-gray-700 font-medium">Select Items</label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-blue-600 flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                {selectedItems.length === staticItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pb-4">
              {staticItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleItemSelect(item)}
                  className={`border-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedItems.includes(item)
                      ? 'bg-[#E27D60] text-white border-[#E27D60]'
                      : 'border-gray-300 hover:border-[#E27D60]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white mt-auto">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedItems([]);
                setSelectedLocation('');
              }}
              className="border text-black font-medium py-2 px-4 rounded-lg"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#E27D60] text-white font-medium py-2 px-4 rounded-lg ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
