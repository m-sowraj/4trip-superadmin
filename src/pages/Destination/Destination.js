import { Edit, SearchIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "./AddDestinaton";
import { toast } from "react-toastify";

const Destination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [Destination, setDestination] = useState([]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("https://fourtrip-server.onrender.com/api/superadmin/allplaces");
      const data = await response.json();
      setDestination(data.data);
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-yellow-500";
      case "Freezed":
        return "text-red-500";
      default:
        return "";
    }
  };

  // Download as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Destination); // Convert JSON to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Destination"); // Add the worksheet
    XLSX.writeFile(workbook, "Destination_Data.xlsx"); // Download the file
  };

  // Download as CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(Destination);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Destination_Data.csv");
    link.click();
  };

  // Download as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Destination Data", 20, 10);
    const tableColumn = [
      "Sr. No.",
      "Partner Name",
      "Email",
      "Phone Number",
      "Registration Date",
      "Status",
    ];
    const tableRows = Destination.map((Partner, index) => [
      index + 1,
      Partner.name,
      Partner.email,
      Partner.phone,
      Partner.location,
      Partner.status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Destination_Data.pdf");
  };

  // Filter logic
  const filteredDestination = Destination.filter((Partner) => {
    const matchesSearch = Partner.place_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); // Change name to place
    // const matchesDate = dateFilter ? Partner.date === dateFilter : true;
    // const matchesStatus = statusFilter
    //   ? Partner.status === statusFilter
    //   : true;
    return matchesSearch
  });

  // Handle status toggle in the table
  const toggleStatus = (id) => {
    // Toggle the status for the given id
    const updatedDestination = Destination.map((dest) =>
      dest.id === id
        ? { ...dest, status: dest.status === "Active" ? "Inactive" : "Active" }
        : dest
    );
    // Set the updated destination array to state (if needed)
  };

  const handleViewImage = (place) => {
    // If you have an image URL, you can open it in a new window
    if (place.image) {
      window.open(place.image, '_blank');
    } else {
      toast.info('No image available');
    }
  };

  const handleEdit = async (place) => {
    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/superadmin/places/${place._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place_name: place.place_name,
          location: place.location,
          nearby: place.nearby,
          best_time: place.best_time,
          short_summary: place.short_summary,
        }),
      });

      if (!response.ok) throw new Error('Failed to update place');
      
      toast.success('Place updated successfully');
      fetchDestinations();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;

    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/superadmin/places/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete place');
      
      toast.success('Place deleted successfully');
      fetchDestinations();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-[90%] flex flex-col">
      {isModalOpen && <Modal setIsOpen={setIsModalOpen} onUpdate={() => fetchDestinations()} />}
      
      <div className="flex items-center justify-between w-full mb-4">
        <div className="font-medium text-black text-xl">Place to Visit</div>
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer px-4 py-1 text-white rounded-md bg-[#E27D60]"
        >
          Add Place
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md w-full flex flex-col overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
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
              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter by Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Download Button */}
              <div className="relative inline-block">
                <button
                  className="bg-[var(--green)] text-white px-4 py-2 rounded-lg"
                  onClick={toggleDropdown}
                >
                  Download
                </button>
                {dropdownOpen && (
                  <div className="absolute bg-white border border-gray-300 shadow-lg rounded-lg mt-2 w-40 z-10">
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

        {/* Table with scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full bg-white">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left">Sr. No.</th>
                  <th className="p-4 text-left">Place Name</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Destination.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Loading...</td>
                  </tr>
                ) : (
                  filteredDestination.map((place, index) => (
                    <tr key={place._id} className="border-t">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{place.place_name}</td>
                      <td className="p-4">{place.location}</td>
                      <td className={`p-4 ${getStatusClass(place.status)}`}>
                        {place.status}
                      </td>
                      <td className="p-4 flex items-center space-x-2">
                        <button 
                          className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                          onClick={() => handleViewImage(place)}
                        >
                          View Image
                        </button>
                        <button 
                          className="p-2 bg-green-100 rounded-md hover:bg-green-200"
                          onClick={() => handleEdit(place)}
                        >
                          <Edit className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                          className="p-2 bg-red-100 rounded-md hover:bg-red-200"
                          onClick={() => handleDelete(place._id)}
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
