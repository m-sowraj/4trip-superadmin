import { Pencil, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddItemForm = ({
  onClose,
  staticItems,
  locations,
  selectedLocation,
  onLocationChange,
  alreadySelectedItems,
  onAddItems
}) => {
  const [selectedItems, setSelectedItems] = useState([...alreadySelectedItems]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemSelect = (item) => {
    // Don't allow deselecting already selected items
    if (alreadySelectedItems.includes(item)) {
      return;
    }

    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === staticItems.length
        ? [...alreadySelectedItems]
        : [...staticItems]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    // Only submit items that are newly selected (not already selected)
    const newItems = selectedItems.filter(
      (item) => !alreadySelectedItems.includes(item)
    );

    if (newItems.length === 0) {
      toast.error('No new items selected to add');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddItems(newItems);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-medium">Add Things to Carry</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="px-6 flex-1 overflow-auto">
          <div className="space-y-4">
            <div className="sticky top-0 bg-white pt-2 pb-4 z-10">
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Location
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              >
                {locations.length === 0 ? (
                  <option value="">Select a location</option>
                ) : (
                  locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))
                )}
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
                {selectedItems.length === staticItems.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pb-4">
              {staticItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleItemSelect(item)}
                  className={`border-2 px-3 py-2 rounded-lg transition-colors ${
                    alreadySelectedItems.includes(item)
                      ? 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                      : selectedItems.includes(item)
                      ? 'bg-[#E27D60] text-white border-[#E27D60]'
                      : 'border-gray-300 hover:border-[#E27D60]'
                  }`}
                  disabled={alreadySelectedItems.includes(item)}
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
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#E27D60] text-white font-medium py-2 px-4 rounded-lg ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Items'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
