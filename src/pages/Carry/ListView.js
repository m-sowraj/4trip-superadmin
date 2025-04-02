import { Trash2 } from 'lucide-react';
import React from 'react';

const ListView = ({
  items,
  loading,
  locations,
  selectedLocation,
  onLocationChange,
  onDeleteItem
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">List of Things to Carry</h1>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="border rounded-md px-4 py-2 min-w-[200px]"
          >
            {locations.length === 0 ? (
              <option value="">Select Location</option>
            ) : (
              locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))
            )}
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
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Trash2
                          className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-700"
                          onClick={() => onDeleteItem(item._id)}
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
