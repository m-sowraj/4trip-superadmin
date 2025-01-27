import { Pencil } from 'lucide-react';
import React, { useState } from 'react';

const AddItemForm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // List of items to select from
  const items = ['Bag', 'Case', 'Card', 'Laptop', 'Headphones', 'Charger'];

  // Toggle item selection
  const handleItemSelect = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item]
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', name);
    console.log('Location:', location);
    console.log('Selected items:', selectedItems);
  };

  // Clear form fields and selected items
  const handleClear = () => {
    setName('');
    setLocation('');
    setSelectedItems([]);
  };

  // Select all items
  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]); // Deselect all if all are selected
    } else {
      setSelectedItems(items); // Select all if none are selected
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-medium mb-4">Add Thing to Carry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Enter Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Enter Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="w-full flex items-start justify-between">
          <div>Select Items</div>
          <div
            onClick={handleSelectAll}
            className="text-gray-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Select All
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleItemSelect(item)}
                className={`border-2 px-3 py-2 rounded-full ${
                  selectedItems.includes(item)
                    ? 'bg-[#E27D60] text-white'
                    : 'hover:bg-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleClear}
            className="border text-black font-medium py-1 px-4 rounded-lg"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-[#E27D60] text-white font-medium py-1 px-4 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
