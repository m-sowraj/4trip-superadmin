import {
  Edit,
  SearchIcon,
  Trash,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "./AddDestinaton"; // Ensure the import path is correct
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";

const Destination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const fetchDestinations = async () => {
    try {
      const response = await axiosInstance.get("/destination");
      setDestinations(response.data.data);
    } catch (error) {
      toast.error("Error fetching destinations");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Download as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(destinations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Destinations");
    XLSX.writeFile(workbook, "Destinations_Data.xlsx");
  };

  // Download as CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(destinations);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Destinations_Data.csv");
    link.click();
  };

  // Download as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Destinations Data", 20, 10);
    const tableColumn = [
      "Sr. No.",
      "Place Name",
      "Location",
      "Nearby Attractions",
      "Best Time to Visit",
      "Short Summary",
      "Top Destination",
    ];
    const tableRows = destinations.map((destination, index) => [
      index + 1,
      destination.place_name,
      destination.locationName,
      destination.near_by_attractions,
      destination.best_time_to_visit,
      destination.short_summary,
      destination.top_destination ? "Yes" : "No",
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Destinations_Data.pdf");
  };

  // Filter logic
  const filteredDestinations = destinations.filter((destination) =>
    destination.place_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewImage = (place) => {
    if (place.image_urls && place.image_urls.length > 0) {
      setPreviewImages(place.image_urls);
      setCurrentImageIndex(0);
      setImagePreview(true);
    } else {
      toast.info("No images available");
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;

    try {
      await axiosInstance.delete(`/superadmin/places/${id}`);
      toast.success("Place deleted successfully");
      await fetchDestinations();
    } catch (error) {
      toast.error("Failed to delete place");
    }
  };

  return (
    <div className="w-full h-[90%] flex flex-col">
      {isModalOpen && (
        <Modal setIsOpen={setIsModalOpen} onUpdate={fetchDestinations} />
      )}
      {isEditModalOpen && (
        <Modal
          setIsOpen={setIsEditModalOpen}
          onUpdate={fetchDestinations}
          editingPlace={editingPlace}
        />
      )}

      {imagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setImagePreview(null);
            setPreviewImages([]);
            setCurrentImageIndex(0);
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImages[currentImageIndex]}
              alt={`Preview ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {previewImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white">
                  {currentImageIndex + 1} / {previewImages.length}
                </div>
              </>
            )}

            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              onClick={() => {
                setImagePreview(null);
                setPreviewImages([]);
                setCurrentImageIndex(0);
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between w-full mb-4">
        <div className="font-medium text-black text-xl">Places to Visit</div>
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer px-4 py-1 text-white rounded-md bg-[#E27D60]"
        >
          Add Place
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md w-full flex flex-col overflow-hidden">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center border bg-white px-4 rounded-full border-gray-300">
              <SearchIcon className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="border-none outline-none rounded-lg p-2 w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-6">
              <div className="relative inline-block">
                <button
                  className="bg-[var(--green)] text-white px-4 py-2 rounded-lg"
                  onClick={toggleDropdown}
                >
                  Download
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 bg-white border border-gray-300 shadow-lg rounded-lg mt-2 w-40 z-40">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          exportToExcel();
                          setDropdownOpen(false);
                        }}
                      >
                        Download as Excel
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          exportToCSV();
                          setDropdownOpen(false);
                        }}
                      >
                        Download as CSV
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          exportToPDF();
                          setDropdownOpen(false);
                        }}
                      >
                        Download as PDF
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full bg-white">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left">Sr. No.</th>
                  <th className="p-4 text-left">Place Name</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No destinations found
                    </td>
                  </tr>
                ) : (
                  filteredDestinations.map((destination, index) => (
                    <tr key={destination._id} className="border-t">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{destination.place_name}</td>
                      <td className="p-4">{destination.locationName}</td>
                      <td className="p-4 flex items-center space-x-2">
                        <button
                          className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                          onClick={() => handleViewImage(destination)}
                        >
                          View Image
                        </button>
                        <button
                          className="p-2 bg-green-100 rounded-md hover:bg-green-200"
                          onClick={() => handleEdit(destination)}
                        >
                          <Edit className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                          className="p-2 bg-red-100 rounded-md hover:bg-red-200"
                          onClick={() => handleDelete(destination._id)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
