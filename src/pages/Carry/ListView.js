import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const ListView = () => {
  // State for managing items, modal visibility, and form fields
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);

  // Function to handle modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle form submission to add a new item
  const handleAddItem = () => {
    if (newItemName && newItemImage) {
      const newItem = {
        id: items.length + 1,
        name: newItemName,
        image: URL.createObjectURL(newItemImage), // Create a URL for the image
      };
      setItems([...items, newItem]);
      setNewItemName('');
      setNewItemImage(null);
      toggleModal(); // Close the modal after adding
    } else {
      alert('Please provide both item name and image.');
    }
  };

  return (
    <div>
      {/* Header and Add Item Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium">List of Things</h1>
        <button
          onClick={toggleModal}
          className="bg-[#E27D60] text-white px-4 py-2 rounded-lg"
        >
          Add item
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-none bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-gray-700">Sr No.</th>
            <th className="px-4 py-2 bg-gray-200 text-gray-700">Name</th>
            <th className="px-4 py-2 bg-gray-200 text-gray-700">Image</th>
            <th className="px-4 py-2 bg-gray-200 text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">{item.name}</td>
              <td className="px-4 py-2 text-center">
                {/* <img src={item.image} alt={item.name} className="flex justify-center w-16 h-16 object-cover text-center" /> */}
              </td>
              <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                <button className="bg-[#E27D60] px-2 py-1 text-white text-sm rounded-md hover:text-blue-700">View Edit</button>
                <Trash2 className="w-5 h-5 text-[#E27D60] cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add Item</h2>
            <div className="mb-4">
              <label className="block mb-2">Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter item name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Item Image</label>
              <input
                type="file"
                onChange={(e) => setNewItemImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={toggleModal}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="bg-[#E27D60] text-white px-4 py-2 rounded-lg"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
