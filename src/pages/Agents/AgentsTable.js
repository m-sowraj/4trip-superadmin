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
  const [allData, setAllData] = useState([]);

  const [editAgent, setEditAgent] = useState(null);
  const [editName, setEditName] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState(false);

  // Fetch agents data
  const handleFreeze = async (id, is_deleted) => {
    try {
      await axiosInstance.put(`/auth/${id}`, {
        is_deleted: !is_deleted,
      });
      toast.success(`Agent ${is_deleted ? "frozen" : "unfrozen"} successfully`);
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axiosInstance.get("/auth?role=Agent&isNew=false");
      console.log("Consoling the response: ", response.data.data);
      setAllData(response.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Filter agents based on search term, date, and status
  useEffect(() => {
    if (allData.length > 0) {
      const filtered = allData.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDate =
          !dateFilter || item.createdAt.split("T")[0] === dateFilter;
        const matchesStatus =
          !statusFilter ||
          (statusFilter === "Active" ? !item.is_deleted : item.is_deleted);
        return matchesSearch && matchesDate && matchesStatus;
      });
      console.log("Filtered :", filtered);
      setAgents(filtered);
    }
  }, [allData, searchTerm, dateFilter, statusFilter]);

  // Download as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(agents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
    XLSX.writeFile(workbook, "Agents_Data.xlsx");
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
    const tableColumn = [
      "Sr. No.",
      "Agent Name",
      "Email",
      "Phone Number",
      "Registration Date",
      "Status",
    ];
    const tableRows = agents.map((agent, index) => [
      index + 1,
      agent.name,
      agent.email,
      agent.phone_number,
      agent.createdAt.split("T")[0],
      agent.is_deleted ? "Inactive" : "Active",
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Agents_Data.pdf");
  };

  // Handle edit and delete actions
  const handleEdit = (agent) => {
    agent.password = "";
    setEditAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleEditName = (agent) => {
    setEditName(agent);
    setIsNameEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await axiosInstance.delete(`/auth/${id}`, {
        is_deleted: true,
      });
      toast.success("Agent deleted successfully");
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editAgent) return;

    try {
      const updatedData = {
        email: editAgent.email,
        phone_number: editAgent.phone_number,
      };
      if (editAgent.password) {
        updatedData.password = editAgent.password;
      }

      await axiosInstance.put(`/auth/${editAgent._id}`, updatedData);
      toast.success("Agent details updated successfully");
      setIsEditModalOpen(false);
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSaveNameEdit = async () => {
    if (!editName) return;

    try {
      await axiosInstance.put(`/auth/${editName._id}`, {
        name: editName.name,
      });
      toast.success("Agent name updated successfully");
      setIsNameEditModalOpen(false);
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleInputChange = (e) => {
    if (editAgent) {
      setEditAgent({ ...editAgent, [e.target.name]: e.target.value });
    }
  };

  const handleNameInputChange = (e) => {
    if (editName) {
      setEditName({ ...editName, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="w-full h-[99%] flex flex-col">
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
                  onClick={() => {
                    exportToExcel();
                  }}
                >
                  Download
                </button>
                <div className="absolute bg-white border border-gray-300 shadow-lg rounded-lg mt-2 w-40 z-50 hidden">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={exportToExcel}
                    >
                      Download as Excel
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={exportToCSV}
                    >
                      Download as CSV
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={exportToPDF}
                    >
                      Download as PDF
                    </li>
                  </ul>
                </div>
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
                  <th className="p-4 text-left">Agent Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone Number</th>
                  <th className="p-4 text-left">Registration Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr
                    key={agent._id}
                    className={`border-t ${
                      agent.is_deleted ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{agent.name}</td>
                    <td className="p-4">{agent.email}</td>
                    <td className="p-4">{agent.phone_number}</td>
                    <td className="p-4">{agent.createdAt.split("T")[0]}</td>
                    <td className="p-4">
                      {agent.is_deleted ? "Inactive" : "Active"}
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <button
                        className="p-2 bg-green-100 rounded-md hover:bg-green-200"
                        onClick={() => handleEdit(agent)}
                      >
                        <Edit className="w-4 h-4 text-green-500" />
                      </button>
                      <button
                        className="p-2 bg-red-100 rounded-md hover:bg-red-200"
                        onClick={() => handleDelete(agent._id)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </button>
                      <button
                        className={`p-2 ${
                          agent.is_deleted ? "bg-orange-100" : "bg-blue-100"
                        } rounded-md hover:opacity-80 ${
                          agent.is_deleted ? "opacity-50" : ""
                        }`}
                        onClick={() =>
                          handleFreeze(agent._id, agent.is_deleted)
                        }
                      >
                        {agent.is_deleted ? "Unfreeze" : "Freeze"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Agent Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editAgent?.email || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={editAgent?.phone_number || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isNameEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Agent Name</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editName?.name || ""}
                onChange={handleNameInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsNameEditModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNameEdit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsTable;
