import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import axiosInstanceAnalyticResearchService from "../../utils/axiosInstanceAnalyticResearchService";
import {
  FaUserGraduate,
  FaUniversity,
  FaEye,
  FaCheck,
  FaDownload,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const ResearcherManagement = () => {
  const [researchers, setResearchers] = useState([]);
  const [validResearchers, setValidResearchers] = useState([]);
  const [takenResearchers, setTakenResearchers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchAllResearchers(),
          fetchValidResearchers(),
          fetchTakenResearchers(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load researcher data. Please try again.");
        toast.error("Error loading researcher data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAllResearchers(),
        fetchValidResearchers(),
        fetchTakenResearchers(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading researcher data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllResearchers = async () => {
    try {
      const response = await axiosInstanceAnalyticResearchService.get(
        "/registered/all"
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setResearchers(data);
    } catch (error) {
      console.error("Error fetching all researchers:", error);
      if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("Network Error")
      ) {
        setError(
          "Backend server is not running or not accessible at port 8095"
        );
      }
      setResearchers([]);
      throw error;
    }
  };

  const fetchValidResearchers = async () => {
    try {
      const response = await axiosInstanceAnalyticResearchService.get(
        "/applied/all"
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setValidResearchers(data);
    } catch (error) {
      console.error("Error fetching valid researchers:", error);
      setValidResearchers([]);
    }
  };

  const fetchTakenResearchers = async () => {
    try {
      const response = await axiosInstanceAnalyticResearchService.get(
        "/taken/all"
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setTakenResearchers(data);
    } catch (error) {
      console.error("Error fetching taken researchers:", error);
      setTakenResearchers([]);
    }
  };

  const giveAccess = async (researcherId) => {
    try {
      await axiosInstanceAnalyticResearchService.get(
        `/give-access/${researcherId}`
      );
      toast.success("Access granted and email sent successfully!");
      fetchData();
    } catch (error) {
      console.error("Error granting access:", error);
      toast.error("Error granting access or sending email to researcher");
    }
  };

  const downloadHealthData = async (researcherId, researcherName) => {
    try {
      const response = await axiosInstanceAnalyticResearchService.get(
        `/get/analytic-data/${researcherId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `health-data-${researcherName}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Health data downloaded successfully!");
      fetchData(); // Refresh to update the taken status
    } catch (error) {
      console.error("Error downloading health data:", error);
      toast.error("Error downloading health data");
    }
  };

  const viewDetails = (researcher) => {
    setSelectedResearcher(researcher);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedResearcher(null);
  };

  const getStatusColor = (isValid, isTaken) => {
    if (isTaken) return "text-green-600";
    if (isValid) return "text-blue-600";
    return "text-yellow-600";
  };

  const getStatusText = (isValid, isTaken) => {
    if (isTaken) return "Data Downloaded";
    if (isValid) return "Access Granted";
    return "Pending Approval";
  };

  const getStatusIcon = (isValid, isTaken) => {
    if (isTaken) return <FaCheckCircle />;
    if (isValid) return <FaCheck />;
    return <FaClock />;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (params) => (
        <span className="font-medium">#{params.value}</span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FaUserGraduate className="text-blue-500" />
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "designation", headerName: "Designation", width: 150 },
    {
      field: "institute",
      headerName: "Institute",
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FaUniversity className="text-gray-500" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const { isValid, isTaken } = params.row;
        return (
          <div
            className={`flex items-center gap-1 ${getStatusColor(
              isValid,
              isTaken
            )}`}
          >
            {getStatusIcon(isValid, isTaken)}
            <span className="text-sm font-medium">
              {getStatusText(isValid, isTaken)}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const { isValid, isTaken } = params.row;
        return (
          <div className="flex gap-1">
            <button
              onClick={() => viewDetails(params.row)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1"
            >
              <FaEye /> View
            </button>

            {!isValid && !isTaken && (
              <button
                onClick={() => giveAccess(params.row.id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1"
              >
                <FaCheck /> Approve
              </button>
            )}

            {isValid && !isTaken && (
              <button
                onClick={() =>
                  downloadHealthData(params.row.id, params.row.name)
                }
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1"
              >
                <FaDownload /> Download
              </button>
            )}

            {isTaken && (
              <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                <FaCheckCircle /> Completed
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "valid":
        return Array.isArray(validResearchers)
          ? validResearchers.map((item, index) => ({
              ...item,
              id: item.id || index,
            }))
          : [];
      case "taken":
        return Array.isArray(takenResearchers)
          ? takenResearchers.map((item, index) => ({
              ...item,
              id: item.id || index,
            }))
          : [];
      default:
        return Array.isArray(researchers)
          ? researchers.map((item, index) => ({
              ...item,
              id: item.id || index,
            }))
          : [];
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "valid":
        return validResearchers.length;
      case "taken":
        return takenResearchers.length;
      default:
        return researchers.length;
    }
  };

  return (
    <div className="researcher-management p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Research Analytics Management
        </h1>
        <p className="text-gray-600">
          Manage researcher applications and health data access requests
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-red-800 underline hover:text-red-900 mt-2"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Applications ({getTabCount("all")})
        </button>
        <button
          onClick={() => setActiveTab("valid")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "valid"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Approved ({getTabCount("valid")})
        </button>
        <button
          onClick={() => setActiveTab("taken")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "taken"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed ({getTabCount("taken")})
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <FaClock className="text-2xl text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Pending Approval
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {Array.isArray(researchers)
                  ? researchers.filter((r) => !r.isValid && !r.isTaken).length
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <FaCheck className="text-2xl text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Approved</h3>
              <p className="text-2xl font-bold text-green-600">
                {validResearchers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <FaDownload className="text-2xl text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-800">Data Downloaded</h3>
              <p className="text-2xl font-bold text-purple-600">
                {takenResearchers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-lg shadow">
        <DataGrid
          rows={getCurrentData()}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={isLoading}
          autoHeight
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              padding: "8px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              fontWeight: "bold",
            },
          }}
        />
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedResearcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Researcher Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="flex items-center gap-2">
                      <FaUserGraduate className="text-blue-500" />
                      <span className="font-medium">
                        {selectedResearcher.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p>{selectedResearcher.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <p>{selectedResearcher.designation}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institute
                    </label>
                    <div className="flex items-center gap-2">
                      <FaUniversity className="text-gray-500" />
                      <span>{selectedResearcher.institute}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Research Purpose
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p>{selectedResearcher.purpose}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div
                    className={`flex items-center gap-2 ${getStatusColor(
                      selectedResearcher.isValid,
                      selectedResearcher.isTaken
                    )}`}
                  >
                    {getStatusIcon(
                      selectedResearcher.isValid,
                      selectedResearcher.isTaken
                    )}
                    <span className="font-medium">
                      {getStatusText(
                        selectedResearcher.isValid,
                        selectedResearcher.isTaken
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                {!selectedResearcher.isValid && !selectedResearcher.isTaken && (
                  <button
                    onClick={() => {
                      giveAccess(selectedResearcher.id);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Grant Access
                  </button>
                )}

                {selectedResearcher.isValid && !selectedResearcher.isTaken && (
                  <button
                    onClick={() => {
                      downloadHealthData(
                        selectedResearcher.id,
                        selectedResearcher.name
                      );
                      closeModal();
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Download Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherManagement;
