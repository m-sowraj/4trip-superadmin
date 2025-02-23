import { Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';
import axiosInstance from "../../utils/axios";

const ListView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get("/locations");
        setLocations(response.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
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
        const response = await axiosInstance.get(`/superadmin/thingstocarry/${selectedLocation}`);
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

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await axiosInstance.delete(`/superadmin/thingstocarry/${selectedLocation}/${itemId}`);
      
      if (!response.ok) throw new Error('Failed to delete item');
      
      toast.success('Item deleted successfully');
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">List of Things to Carry</h1>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border rounded-md px-4 py-2 min-w-[200px]"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !selectedLocation ? (
          <div className="text-center py-8 text-gray-500">
            Please select a location to view items
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items found for this location
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Sr No.</th>
                  <th className="px-4 py-3 text-left">Item Name</th>
                  {/* <th className="px-4 py-3 text-left">Location</th> */}
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    {/* <td className="px-4 py-3">{item.location_name}</td> */}
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Trash2
                          className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
