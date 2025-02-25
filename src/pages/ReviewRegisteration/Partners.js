import { Edit, SearchIcon, Trash, Eye, X, Check } from "lucide-react";
import { useState, useEffect } from "react"; // Add useEffect import
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import axios from '../../utils/axios';

// Add ViewModal component
const ViewModal = ({ isOpen, onClose, partner }) => {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
        <div className="flex gap-6">
          {/* Logo Section - Left Side */}
          <div className="flex-shrink-0">
            {partner.logo_url ? (
              <div className="relative w-40 h-40">
                <img 
                  src={partner.logo_url} 
                  alt={`${partner.business_name} logo`}
                  className="w-full h-full rounded-2xl object-cover border-2 border-gray-100 shadow-md"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5"></div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-gray-100 shadow-md">
                <span className="text-5xl font-semibold text-gray-400">
                  {partner.business_name?.charAt(0) || partner.owner_name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Header and Content - Right Side */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{partner.business_name || partner.owner_name}</h2>
                <p className="text-gray-500 mt-1">{partner.email}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Divider */}
            <div className="border-b mb-6"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-6">
          {/* Your existing content sections with updated styling */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="font-medium text-gray-700">Business Name</label>
                <p>{partner.business_name}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Owner Name</label>
                <p>{partner.owner_name}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Email</label>
                <p>{partner.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Phone Number</label>
                <p>{partner.phone_number}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Category</label>
                <p>{partner.select_category}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Shop Type</label>
                <p>{partner.shopType || 'N/A'}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Address</label>
                <p>{partner.address}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">City</label>
                <p>{partner.city}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Pincode</label>
                <p>{partner.pincode}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
            <div className="mt-1">
              <p>Days: {partner.businessHours?.days?.join(', ') || 'N/A'}</p>
              <p>Opening Time: {partner.businessHours?.openingTime || 'N/A'}</p>
              <p>Closing Time: {partner.businessHours?.closingTime || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnersTableReview = ({ Partners, onUpdate }) => {
  // Add refresh state
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "Declined":
        return "text-red-500";
      default:
        return "";
    }
  };

  // Download as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Partners); // Convert JSON to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners"); // Add the worksheet
    XLSX.writeFile(workbook, "Partners_Data.xlsx"); // Download the file
  };

  // Download as CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(Partners);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Partners_Data.csv");
    link.click();
  };

  // Download as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Partners Data", 20, 10);
    const tableColumn = [
      "Sr. No.",
      "Partner Name",
      "Email",
      "Phone Number",
      "Registration Date",
      "Status",
    ];
    const tableRows = Partners.map((Partner, index) => [
      index + 1,
      Partner.owner_name,
      Partner.email,
      Partner.phone_number,
      Partner.location,
      Partner.status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Partners_Data.pdf");
  };

  // Add useEffect for refresh
  useEffect(() => {
    if (refreshKey > 0) {
      onUpdate();
    }
  }, [refreshKey, onUpdate]);

  // Update accept handler
  const handleAccept = async (id) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        isNew: false,
        isActive: true,
        status: "Active"
      });

      if (response.status !== 200) throw new Error('Failed to accept partner');
      
      toast.success('Partner accepted successfully');
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update decline handler
  const handleDecline = async (id) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        isActive: false,
        status: "Declined",
        isNew: false
      });

      if (response.status !== 200) throw new Error('Failed to decline partner');
      
      toast.success('Partner declined successfully');
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter logic
  const filteredPartners = Partners.filter((partner) => {
    const matchesSearch = partner.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = startDate && endDate ? 
      partner.createdAt.split("T")[0] >= startDate && 
      partner.createdAt.split("T")[0] <= endDate : true;
    const matchesStatus = statusFilter ? partner.status === statusFilter : true;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="w-full h-[100%] flex flex-col">
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
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  min={startDate}
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter by Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
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
                  <div className="absolute bg-white border border-gray-300 shadow-lg rounded-lg mt-2 w-40">
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
                  <th className="p-4 text-left">Logo</th>
                  <th className="p-4 text-left">Partner Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Phone Number</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((partner, index) => (
                  <tr key={partner._id} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={`${partner.owner_name} logo`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{partner.owner_name.charAt(0)}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">{partner.owner_name}</td>
                    <td className="p-4">{partner.select_category}</td>
                    <td className="p-4">{partner.phone_number}</td>
                    <td className="p-4">{partner.address}</td>
                    <td className="p-4">{partner.status}</td>
                    <td className="p-4 flex items-center space-x-2">
                      <button 
                        className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button 
                        className="p-2 bg-green-100 rounded-md hover:bg-green-200"
                        onClick={() => handleAccept(partner._id)}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </button>
                      <button 
                        className="p-2 bg-red-100 rounded-md hover:bg-red-200"
                        onClick={() => handleDecline(partner._id)}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        partner={selectedPartner}
      />
    </div>
  );
};

export default PartnersTableReview;
