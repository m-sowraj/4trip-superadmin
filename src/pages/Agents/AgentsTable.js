import { Edit, SearchIcon, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";

const AgentsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


    const [agents, setAgents] = useState([]);
    const [Partners, setPartners] = useState([]);
    const [allData, setAllData] = useState([]);
    
    // Add fetchAgents function
    const fetchAgents = async () => {
        try {
            const response = await axiosInstance.get("/commonauth/users?type=agent&is_new=false");
            setAllData(response.data.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Replace the existing useEffect with this
    useEffect(() => {
        fetchAgents();
    }, []);
    
    // Filter Agents and Partners by using reg_type, then push them to their respective arrays
    useEffect(() => {
        if (allData.length > 0) {
            const agents = allData.filter(item => item.reg_type === "agent");
            const partners = allData.filter(item => item.reg_type === "partner");
            setAgents(agents);
            setPartners(partners);
        }
    }
    , [allData])

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getStatusClass = (status, isDeleted) => {
    if (isDeleted) return "text-gray-400 line-through";
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
      agent.agent.createdAt.split("T")[0],
      agent.status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Agents_Data.pdf");
  };

  // Add this helper function at the top of the component
  const getUniqueDates = (agents) => {
    const dates = agents.map(agent => agent.createdAt.split('T')[0]);
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  };

  // Add these new state variables at the top with other state declarations
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Replace the existing date filter logic in filteredAgents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // New date range filter logic
    const agentDate = new Date(agent.createdAt.split('T')[0]);
    const matchesDate = (!startDate || new Date(startDate) <= agentDate) && 
                       (!endDate || new Date(endDate) >= agentDate);
    
    const matchesStatus = statusFilter ? 
      (statusFilter === 'Deleted' && agent.is_deleted) || 
      (!agent.is_deleted && (
        (statusFilter === 'Active' && agent.isActive) ||
        (statusFilter === 'Inactive' && !agent.isActive)
      )) : true;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Add these new state variables
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Add these new functions
  const handleEdit = async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`/commonauth/user/${id}`, updatedData);

      if (!response.ok) throw new Error('Failed to update agent');
      
      toast.success('Agent updated successfully');
      fetchAgents();
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      const response = await axiosInstance.put(`/commonauth/user/${id}`, {
        is_deleted: true
      });

      if (!response.ok) throw new Error('Failed to delete agent');
      
      toast.success('Agent deleted successfully');
      // Refresh the data
      fetchAgents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFreeze = async (id, currentStatus) => {
    try {
      const response = await axiosInstance.put(`/commonauth/user/${id}`, {
        isActive: !currentStatus
      });

      if (!response.ok) throw new Error('Failed to update agent status');
      
      toast.success(`Agent ${currentStatus ? 'frozen' : 'unfrozen'} successfully`);
      // Refresh the data
      fetchAgents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add this modal component inside AgentsTable but before the return statement
  const EditModal = ({ isOpen, onClose, agent, onSave }) => {
    const [formData, setFormData] = useState({
      owner_name: agent?.owner_name || '',
      email: agent?.email || '',
      phone_number: agent?.phone_number || '',
      address: agent?.address || '',
      city: agent?.city || '',
      pincode: agent?.pincode || ''
    });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(agent._id, formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Agent</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
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
    <div className="w-full h-[80%]   flex flex-col">
      <div className="font-medium text-black text-xl p-4">Agents Management</div>

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
                    min={startDate} // Prevents selecting end date before start date
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

                <div className="relative inline-block">
        <button
          className="bg-[var(--green)] text-white px-4 py-2 rounded-lg"
          onClick={toggleDropdown}
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

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        {/* Update the height to use remaining space */}
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
              {filteredAgents.map((agent, index) => (
              <tr key={agent._id} className={`border-t ${agent.is_deleted || agent.status === "Declined" ? 'bg-gray-50' : ''}`}>
                  <td className="p-4">{index + 1}</td>
                  <td className={`p-4 ${agent.is_deleted ? 'text-gray-400' : ''}`}>{agent.owner_name}</td>
                  <td className={`p-4 ${agent.is_deleted ? 'text-gray-400' : ''}`}>{agent.email}</td>
                  <td className={`p-4 ${agent.is_deleted ? 'text-gray-400' : ''}`}>{agent.phone_number}</td>
                  <td className={`p-4 ${agent.is_deleted ? 'text-gray-400' : ''}`}>{agent.createdAt.split("T")[0]}</td>
                  <td className={`p-4 ${getStatusClass(agent.isActive ? 'Active' : 'Inactive', agent.is_deleted || agent.status === "Declined")}`}>
                      {agent.is_deleted ? 'Deleted': agent.status ? agent.status : (agent.isActive ? 'Active' : 'Inactive')}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                  <button 
                      className={`p-2 bg-green-100 rounded-md hover:bg-green-200 ${agent.is_deleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                          if (!agent.is_deleted) {
                              setSelectedAgent(agent);
                              setEditModalOpen(true);
                          }
                      }}
                      disabled={agent.is_deleted || agent.status === "Declined"}
                  >
                      <Edit className={`w-4 h-4 text-green-500 ${agent.is_deleted ? 'opacity-50' : ''}`} />
                  </button>
                  <button 
                      className={`p-2 bg-red-100 rounded-md hover:bg-red-200 ${agent.is_deleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !agent.is_deleted && handleDelete(agent._id)}
                      disabled={agent.is_deleted}
                  >
                      <Trash className={`w-4 h-4 text-red-500 ${agent.is_deleted ? 'opacity-50' : ''}`} />
                  </button>
                  <button 
                      className={`p-2 ${agent.isActive ? 'bg-orange-100' : 'bg-blue-100'} rounded-md hover:opacity-80 ${agent.is_deleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !agent.is_deleted && handleFreeze(agent._id, agent.isActive)}
                      disabled={agent.is_deleted}
                  >
                      {agent.isActive ? 'Freeze' : 'Unfreeze'}
                  </button>
                  </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Add this before the closing div */}
    <EditModal
      isOpen={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      agent={selectedAgent}
      onSave={handleEdit}
    />
  </div>
);
};

export default AgentsTable;
