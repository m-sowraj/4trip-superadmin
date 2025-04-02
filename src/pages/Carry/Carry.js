import React, { useState, useEffect } from 'react';
import ListView from './ListView';
import AddItemForm from './AdditemForm';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

function Carry() {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static items list
  const staticItems = [
    'Bag',
    'Water Bottle',
    'First Aid Kit',
    'Flashlight',
    'Snacks',
    'Camera',
    'Power Bank',
    'Umbrella',
    'Sunscreen',
    'Hat',
    'Walking Shoes',
    'Map'
  ];

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/location');
        setLocations(response.data.data || []);
        // Auto-select first location if available
        if (response.data.data.length > 0) {
          setSelectedLocation(response.data.data[0]._id);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchLocations();
  }, []);

  // Fetch items when location changes
  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedLocation) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/things-to-carry/${selectedLocation}`
        );
        setItems(response.data.data || []);
      } catch (error) {
        toast.error(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedLocation]);

  // Handle adding new items
  const handleAddItems = async (newItems) => {
    try {
      await Promise.all(
        newItems.map((item) =>
          axiosInstance.post('/things-to-carry', {
            name: item,
            location_id: selectedLocation
          })
        )
      );

      // Refresh the items list
      const response = await axiosInstance.get(
        `/things-to-carry/${selectedLocation}`
      );
      setItems(response.data.data || []);

      toast.success('Items added successfully');
      setShowAddItemForm(false);
    } catch (error) {
      toast.error('Failed to add items');
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    try {
      await axiosInstance.delete(
        `/things-to-carry/${selectedLocation}/${itemId}`
      );

      // Refresh the items list
      const response = await axiosInstance.get(
        `/things-to-carry/${selectedLocation}`
      );
      setItems(response.data.data || []);

      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Things to Carry</h1>
        <button
          onClick={() => setShowAddItemForm(true)}
          className="bg-[#E27D60] text-white px-4 py-2 rounded-lg hover:bg-[#d87356] transition-colors"
          disabled={!selectedLocation}
        >
          + Add Items
        </button>
      </div>

      <ListView
        items={items}
        loading={loading}
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onDeleteItem={handleDeleteItem}
      />

      {showAddItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <AddItemForm
              onClose={() => setShowAddItemForm(false)}
              staticItems={staticItems}
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              alreadySelectedItems={items.map((item) => item.name)}
              onAddItems={handleAddItems}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Carry;
