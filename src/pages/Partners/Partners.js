import { Edit, SearchIcon, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import axios from '../../utils/axios';

const PartnersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [Partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get("/commonauth/users?type=partner&is_new=false");
      setPartners(response.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, updatedData);

      if (response.status !== 200) throw new Error('Failed to update partner');
      
      toast.success('Partner updated successfully');
      fetchPartners();
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;

    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        is_deleted: true
      });

      if (response.status !== 200) throw new Error('Failed to delete partner');
      
      toast.success('Partner deleted successfully');
      fetchPartners();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFreeze = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        isActive: !currentStatus
      });

      if (response.status !== 200) throw new Error('Failed to update partner status');
      
      toast.success(`Partner ${currentStatus ? 'frozen' : 'unfrozen'} successfully`);
      fetchPartners();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusClass = (status, isDeleted) => {
    if (isDeleted) return "text-gray-400 line-through";
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-yellow-500";
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

  // Filter logic
  const filteredPartners = Partners.filter((partner) => {
    const matchesSearch = partner.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const partnerDate = new Date(partner.createdAt.split('T')[0]);
    const matchesDate = (!startDate || new Date(startDate) <= partnerDate) && 
                       (!endDate || new Date(endDate) >= partnerDate);
    
    const matchesStatus = statusFilter ? 
      (statusFilter === 'Deleted' && partner.is_deleted) || 
      (!partner.is_deleted && (
        (statusFilter === 'Active' && partner.isActive) ||
        (statusFilter === 'Inactive' && !partner.isActive)
      )) : true;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Edit Modal Component
  const EditModal = ({ isOpen, onClose, partner, onSave }) => {
    const [formData, setFormData] = useState({
      owner_name: partner?.owner_name || '',
      email: partner?.email || '',
      phone_number: partner?.phone_number || '',
      address: partner?.address || '',
      city: partner?.city || '',
      pincode: partner?.pincode || ''
    });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(partner._id, formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Partner</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Same form fields as AgentsTable */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[90%] flex flex-col">
      <div className="font-medium text-black text-xl p-4">Partners Management</div>

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
                <option value="Inactive">Inactive</option>
                <option value="Deleted">Deleted</option>
         
              </select>

              {/* Download Button */}
              <div className="relative inline-block">
                <button
                  className="bg-[var(--green)] text-white px-4 py-2 rounded-lg"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Download
                </button>
                {dropdownOpen && (
                  <div className="absolute bg-white border border-gray-300 shadow-lg rounded-lg mt-2 w-40 z-50">
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
                  <tr key={partner._id} className={`border-t ${partner.is_deleted || partner.status === "Declined" ? 'bg-gray-50' : ''}`}>
                    <td className="p-4">{index + 1}</td>
                    <td className={`p-4 ${partner.is_deleted ? 'text-gray-400' : ''}`}>{partner.owner_name}</td>
                    <td className={`p-4 ${partner.is_deleted ? 'text-gray-400' : ''}`}>{partner.select_category}</td>
                    <td className={`p-4 ${partner.is_deleted ? 'text-gray-400' : ''}`}>{partner.phone_number}</td>
                    <td className={`p-4 ${partner.is_deleted ? 'text-gray-400' : ''}`}>{partner.address}</td>
                    <td className={`p-4 ${getStatusClass(partner.isActive ? 'Active' : 'Inactive', partner.is_deleted || partner.status === "Declined")}`}>
                      {partner.is_deleted ? 'Deleted': partner.status ? partner.status : (partner.isActive ? 'Active' : 'Inactive')}
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <button 
                        className={`p-2 bg-green-100 rounded-md hover:bg-green-200 ${partner.is_deleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (!partner.is_deleted && partner.status !== "Declined") {
                            setSelectedPartner(partner);
                            setEditModalOpen(true);
                          }
                        }}
                        disabled={partner.is_deleted || partner.status === "Declined"}
                      >
                        <Edit className={`w-4 h-4 text-green-500 ${partner.is_deleted ? 'opacity-50' : ''}`} />
                      </button>
                      <button 
                        className={`p-2 bg-red-100 rounded-md hover:bg-red-200 ${partner.is_deleted || partner.status === "Declined" ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !partner.is_deleted && partner.status !== "Declined" && handleDelete(partner._id)}
                        disabled={partner.is_deleted || partner.status === "Declined"}
                      >
                        <Trash className={`w-4 h-4 text-red-500 ${partner.is_deleted ? 'opacity-50' : ''}`} />
                      </button>
                      <button 
                        className={`p-2 ${partner.isActive ? 'bg-orange-100' : 'bg-blue-100'} rounded-md hover:opacity-80 ${partner.is_deleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !partner.is_deleted && handleFreeze(partner._id, partner.isActive)}
                        disabled={partner.is_deleted}
                      >
                        {partner.isActive ? 'Freeze' : 'Unfreeze'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        partner={selectedPartner}
        onSave={handleEdit}
      />
    </div>
  );
};

export default PartnersTable;
