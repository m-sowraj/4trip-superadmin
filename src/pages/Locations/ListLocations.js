import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, Eye, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axios";
const ListLocations = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    map_url: "",
    iframe_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationsPerPage = 10;

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get("/location");
      setLocations(response.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, map_url, iframe_url } = formData;
    if (!name.trim()) {
      toast.error("Name is required.");
      return false;
    }
    if (!map_url) {
      toast.error("Valid map_url is required.");
      return false;
    }
    if (!iframe_url) {
      toast.error("Valid iframe_url is required.");
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    console.log("function triggered");
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/location/create", formData);
      if (response.status !== 201) {
        throw new Error(response.data.message || "Failed to create location.");
      }
      setTimeout(() => {
        toast.success("Location created successfully!");
      }, 1000);
      setIsCreateModalOpen(false);
      setFormData({ name: "", map_url: "", iframe_url: "" });
      fetchLocations();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(
        `/location/${selectedLocation._id}`,formData
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to update location.");
      }

      toast.success("Location updated successfully!");
      setIsEditModalOpen(false);
      fetchLocations();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(`/location/${selectedLocation._id}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to delete location.");
      }
      toast.success("Location deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchLocations();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      map_url: getDecimalValue(location.map_url),
      iframe_url: getDecimalValue(location.iframe_url),
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (location) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (location) => {
    setSelectedLocation(location);
    setIsViewModalOpen(true);
  };

  // Search and Pagination Logic
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );
  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function to extract decimal value
  const getDecimalValue = (value) => {
    if (value && value.$numberDecimal) {
      return value.$numberDecimal;
    }
    return value;
  };

  return (
    <div className="w-full h-[90%] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Locations Management</h2>
        <button
          onClick={() => {
            setFormData({ name: "", map_url: "", iframe_url: "" }); // Reset form
            setIsCreateModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Location
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center border bg-white px-4 rounded-full border-gray-300">
          <SearchIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            className="border-none outline-none rounded-lg p-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Locations Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Map Url</th>
              <th className="p-4 text-left">Iframe Url</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLocations.map((location) => (
              <tr key={location._id} className="border-t">
                <td className="p-4">
                  <p rel="noopener noreferrer" className="text-black  " p>
                    {location.name}
                  </p>
                </td>
                <td className="p-4">
                  <a
                    href={location.map_url}
                    target="_blank"
                    className="p-4 underline text-blue-500 "
                  >
                    click here to navigate
                  </a>
                </td>
                <td className="p-4">
                  <iframe
                    src={location.iframe_url}
                    width="200"
                    height="150"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                  <br />
                </td>

                <td className="p-4 flex items-center space-x-2">
                  <button
                    onClick={() => openViewModal(location)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    {/* <Eye className="w-5 h-5" /> */}
                  </button>
                  <button
                    onClick={() => openEditModal(location)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(location)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {currentLocations.length === 0 && (
              <tr>
                <td className="p-4 text-center" colSpan="4">
                  No Locations Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Location"
      >
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter location name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Map Url</label>
            <input
              type="text"
              name="map_url"
              value={formData.map_url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Map Url"
              step="any"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Iframe Url</label>
            <input
              type="text"
              name="iframe_url"
              value={formData.iframe_url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Iframe Url"
              step="any"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Location"}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Location"
      >
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter location name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Map Url</label>
            <input
              type="text"
              name="map_url"
              value={formData.map_url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter map_url"
              step="any"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Iframe Url</label>
            <input
              type="text"
              name="iframe_url"
              value={formData.iframe_url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter iframe_url"
              step="any"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Location"}
          </button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Location"
      >
        <div className="mb-4">
          <p>Are you sure you want to delete this location?</p>
          <p>
            <strong>Name:</strong> {selectedLocation?.name}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>

      {/* View Modal */}
      {/* <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Location Details"
      >
        {selectedLocation && (
          <div className="mb-4">
            <p>
              <strong>Name:</strong> {selectedLocation.name}
            </p>
            <p>
              <strong>map_url:</strong>{" "}
              {getDecimalValue(selectedLocation.map_url)}
            </p>
            <p>
              <strong>iframe_url:</strong>{" "}
              {getDecimalValue(selectedLocation.iframe_url)}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedLocation.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedLocation.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal> */}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default ListLocations;
