import { Edit, SearchIcon, Trash, X, Eye, Check } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import axios from '../../utils/axios';

// Add Cross as an alias for X
const Cross = X;

// Add ViewModal component
const ViewModal = ({ isOpen, onClose, agent }) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agent Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700">Business Name</label>
              <p>{agent.business_name}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Owner Name</label>
              <p>{agent.owner_name}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Email</label>
              <p>{agent.email}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Phone Number</label>
              <p>{agent.phone_number}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Category</label>
              <p>{agent.select_category}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Shop Type</label>
              <p>{agent.shopType || 'N/A'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Address</label>
              <p>{agent.address}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">City</label>
              <p>{agent.city}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Pincode</label>
              <p>{agent.pincode}</p>
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Business Hours</label>
            <div className="mt-1">
              <p>Days: {agent.businessHours?.days?.join(', ') || 'N/A'}</p>
              <p>Opening Time: {agent.businessHours?.openingTime || 'N/A'}</p>
              <p>Closing Time: {agent.businessHours?.closingTime || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentsTableReview = ({ agents, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

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
    const worksheet = XLSX.utils.json_to_sheet(agents); // Convert JSON to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents"); // Add the worksheet
    XLSX.writeFile(workbook, "Agents_Data.xlsx"); // Download the file
  };

  // Download as CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(agents);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Agents_Data.csv");
    link.click();
  };

  // Download as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Agents Data", 20, 10);
    const tableColumn = ["Sr. No.", "Agent Name", "Email", "Phone Number", "Registration Date", "Status"];
    const tableRows = agents.map((agent, index) => [
      index + 1,
      agent.owner_name,
      agent.email,
      agent.phone_number,
      agent.date,
      agent.status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Agents_Data.pdf");
  };

  // Filter logic
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = startDate && endDate ? agent.createdAt.split("T")[0] >= startDate && agent.createdAt.split("T")[0] <= endDate : true;
    const matchesStatus = statusFilter ? agent.status === statusFilter : true;
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Add accept/decline handlers
  const handleAccept = async (id) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        isNew: false
      });

      if (response.status !== 200) throw new Error('Failed to accept agent');
      
      toast.success('Agent accepted successfully');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await axios.put(`/commonauth/user/${id}`, {
        isActive: false,
        status: "Declined",
        isNew: false
      });

      if (response.status !== 200) throw new Error('Failed to decline agent');
      
      toast.success('Agent declined successfully');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-[90%] flex flex-col">
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
                  placeholder="Start Date"
                  className="border border-gray-300 rounded-lg p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  placeholder="End Date"
                  className="border border-gray-300 rounded-lg p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter by Status</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
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
                  <th className="p-4 text-left">Agent Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone Number</th>
                  <th className="p-4 text-left">Registration Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents?.map((agent, index) => (
                <tr key={agent._id} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{agent.owner_name}</td>
                    <td className="p-4">{agent.email}</td>
                    <td className="p-4">{agent.phone_number}</td>
                    <td className="p-4">{agent.createdAt.split("T")[0]}</td>
                    <td className={`p-4 ${getStatusClass(agent.status)}`}>{agent.status}</td>
                    <td className="p-4 flex items-center space-x-2">
                      <button 
                        className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button 
                        className="p-2 bg-green-100 rounded-md hover:bg-green-200"
                        onClick={() => handleAccept(agent._id)}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </button>
                      <button 
                        className="p-2 bg-red-100 rounded-md hover:bg-red-200"
                        onClick={() => handleDecline(agent._id)}
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
        agent={selectedAgent}
      />
    </div>
  );
};

export default AgentsTableReview;
