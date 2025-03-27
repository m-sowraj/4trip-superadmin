import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../../utils/config";
import axiosInstance from "../../utils/axios";

const Modal = ({ setIsOpen, onUpdate, editingPlace }) => {
  const [placeData, setPlaceData] = useState({
    place_name: editingPlace?.place_name || "",
    location_id: editingPlace?.location_id || "",
    map_link: editingPlace?.map_link || "",
    iframe_url: editingPlace?.iframe_url || "",
    near_by_attractions: editingPlace?.near_by_attractions || "",
    best_time_to_visit: editingPlace?.best_time_to_visit || "",
    short_summary: editingPlace?.short_summary || "",
    image_urls: editingPlace?.image_urls || [],
    top_destination: editingPlace?.top_destination || false,
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
        const response = await axiosInstance.get("/location");
        setLocations(response.data.data);
      } catch (error) {
        toast.error("Error loading locations");
        console.error("Error:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Load existing data into state when editing
  useEffect(() => {
    if (editingPlace) {
      setPlaceData({
        place_name: editingPlace.place_name || "",
        location_id: editingPlace.location_id || "",
        map_link: editingPlace.map_link || "",
        iframe_url: editingPlace.iframe_url || "",
        near_by_attractions: editingPlace.near_by_attractions || "",
        best_time_to_visit: editingPlace.best_time_to_visit || "",
        short_summary: editingPlace.short_summary || "",
        image_urls: editingPlace.image_urls || [],
        top_destination: editingPlace.top_destination || false,
        images: [],
        videos: [],
      });

      if (locations.length > 0) {
        const location = locations.find(
          (loc) => loc._id === editingPlace.location_id
        );
        if (location) {
          setSelectedLocation(location);
        }
      }
    }
  }, [editingPlace, locations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceData({ ...placeData, [name]: value });

    if (name === "location_id") {
      const location = locations.find((loc) => loc._id === value);
      setSelectedLocation(location || null);
    }
  };

  const handleCheckboxChange = (type) => {
    setPlaceData((prev) => ({
      ...prev,
      top_destination: type === "destination" ? !prev.top_destination : false,
    }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(uploadFile);

    try {
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url) => url !== null);

      setPlaceData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...validUrls],
      }));

      toast.success(`${validUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error("Error handling image uploads:", error);
      toast.error("Error uploading images");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setPlaceData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleVideoUpload = (e) => {
    setPlaceData({
      ...placeData,
      videos: [...placeData.videos, e.target.files[0]],
    });
  };

  const handleClear = () => {
    setPlaceData({
      place_name: "",
      location_id: "",
      map_link: "",
      iframe_url: "",
      near_by_attractions: "",
      best_time_to_visit: "",
      short_summary: "",
      image_urls: [],
      images: [],
      videos: [],
      top_destination: false,
    });
    setSelectedLocation(null);
  };

  const handleSave = async () => {
    if (!placeData.place_name || !placeData.location_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = editingPlace
        ? `/destination/${editingPlace._id}`
        : `/destination/create`;

      const method = editingPlace ? "put" : "post";

      const response = await axiosInstance({
        method,
        url,
        data: {
          place_name: placeData.place_name,
          location_id: placeData.location_id,
          map_link: placeData.map_link,
          iframe_url: placeData.iframe_url,
          near_by_attractions: placeData.near_by_attractions,
          best_time_to_visit: placeData.best_time_to_visit,
          short_summary: placeData.short_summary,
          image_urls: placeData.image_urls,
          top_destination: placeData.top_destination,
        },
      });

      toast.success(
        editingPlace
          ? "Place updated successfully!"
          : "Place added successfully!"
      );
      setIsOpen(false);
      if (onUpdate) onUpdate(); // Refresh the parent list
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleClose = () => {
    handleClear();
    setIsOpen(false);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-black/50">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {editingPlace ? "Edit Place" : "Add New Place"}
            </h2>
            <div onClick={handleClose}>
              <X className="w-5 h-5 text-red-500 font-bold cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex flex-col flex-1">
              <label
                htmlFor="place_name"
                className="block text-gray-700 font-medium mb-2"
              >
                Place Name
              </label>
              <input
                type="text"
                id="place_name"
                name="place_name"
                value={placeData.place_name}
                onChange={handleInputChange}
                className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>

            <div className="mb-4 flex flex-col flex-1">
              <label
                htmlFor="location_id"
                className="block text-gray-700 font-medium mb-2"
              >
                Location
              </label>
              {isLoadingLocations ? (
                <div className="border rounded-md px-3 py-2 bg-gray-100">
                  Loading locations...
                </div>
              ) : (
                <select
                  id="location_id"
                  name="location_id"
                  value={placeData.location_id}
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

          <div className="flex gap-4 w-full">
            <div className="flex flex-col flex-1 mb-4">
              <label
                htmlFor="near_by_attractions"
                className="block text-gray-700 font-medium mb-2"
              >
                Nearby Attractions
              </label>
              <input
                id="near_by_attractions"
                name="near_by_attractions"
                value={placeData.near_by_attractions}
                onChange={handleInputChange}
                className="flex flex-1 border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>

            <div className="flex flex-col flex-1 mb-4">
              <label
                htmlFor="best_time_to_visit"
                className="block text-gray-700 font-medium mb-2"
              >
                Best Time to Visit
              </label>
              <input
                type="text"
                id="best_time_to_visit"
                name="best_time_to_visit"
                value={placeData.best_time_to_visit}
                onChange={handleInputChange}
                className="flex flex-1 border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="short_summary"
              className="block text-gray-700 font-medium mb-2"
            >
              Short summary
            </label>
            <textarea
              id="short_summary"
              name="short_summary"
              value={placeData.short_summary}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
            />
          </div>
          <div className="mb-4 flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={placeData.top_destination}
                onChange={() => handleCheckboxChange("destination")}
                className="mr-2"
              />
              Top Destination
            </label>
          </div>

          <div className="mb-4">
            <label
              htmlFor="map_link"
              className="block text-gray-700 font-medium mb-2"
            >
              Map Link
            </label>
            <input
              type="text"
              id="map_link"
              name="map_link"
              value={placeData.map_link}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="iframe_url"
              className="block text-gray-700 font-medium mb-2"
            >
              Iframe URL
            </label>
            <input
              type="text"
              id="iframe_url"
              name="iframe_url"
              value={placeData.iframe_url}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Add Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-md px-3 py-2 w-full"
            />
            {placeData.image_urls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {placeData.image_urls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Add Videos
            </label>
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
              {editingPlace ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
