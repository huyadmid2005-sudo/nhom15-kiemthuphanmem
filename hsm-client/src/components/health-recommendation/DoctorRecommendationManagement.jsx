import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstanceCDSSService from "../../utils/axiosInstanceCDSSService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaPills,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DoctorRecommendationManagement = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceCDSSService.get(
        "/from-doctor/get/byDoctor"
      );
      const recommendationsData = response.data || [];
      setRecommendations(recommendationsData);

      // Fetch patient details for each recommendation
      const patientDetailsMap = {};
      for (const rec of recommendationsData) {
        if (rec.patientId && !patientDetailsMap[rec.patientId]) {
          try {
            const patientResponse = await axiosInstancePatientService.get(
              `/id/${rec.patientId}`
            );
            patientDetailsMap[rec.patientId] = patientResponse.data;
          } catch (error) {
            console.error(`Error fetching patient ${rec.patientId}:`, error);
            patientDetailsMap[rec.patientId] = {
              firstName: "Unknown",
              lastName: "Patient",
            };
          }
        }
      }
      setPatientDetails(patientDetailsMap);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    if (
      !window.confirm("Are you sure you want to delete this recommendation?")
    ) {
      return;
    }

    try {
      await axiosInstanceCDSSService.delete(
        `/from-doctor/delete/${recommendationId}`
      );
      toast.success("Recommendation deleted successfully");
      fetchRecommendations();
    } catch (error) {
      console.error("Error deleting recommendation:", error);
      toast.error("Failed to delete recommendation");
    }
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPatientName = (patientId) => {
    const patient = patientDetails[patientId];
    return patient ? `${patient.firstName} ${patient.lastName}` : "Loading...";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Recommendations
          </h1>
          <p className="text-gray-600">Manage patient health recommendations</p>
        </div>
        <Link
          to="/doctor/health-recommendation/create"
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create New</span>
        </Link>
      </div>

      {/* Recommendations List */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaUser className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {getPatientName(recommendation.patientId)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Patient ID: {recommendation.patientId}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-2">
                      {recommendation.recommendationMessage}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>
                        Created: {formatDate(recommendation.createdDate)}
                      </span>
                    </div>
                    {recommendation.rescheduleAppointment && (
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt className="w-4 h-4 text-orange-500" />
                        <span>
                          Reschedule:{" "}
                          {formatDate(recommendation.rescheduleAppointment)}
                        </span>
                      </div>
                    )}
                    {recommendation.items &&
                      recommendation.items.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <FaPills className="w-4 h-4 text-green-500" />
                          <span>{recommendation.items.length} Medicine(s)</span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDetails(recommendation)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/doctor/health-recommendation/edit/${recommendation.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteRecommendation(recommendation.id)
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
            <FaUser className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first health recommendation for patients
          </p>
          <Link
            to="/doctor/health-recommendation/create"
            className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create Recommendation</span>
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-500 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Recommendation Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Patient Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>
                    <strong>Name:</strong>{" "}
                    {getPatientName(selectedRecommendation.patientId)}
                  </p>
                  <p>
                    <strong>Patient ID:</strong>{" "}
                    {selectedRecommendation.patientId}
                  </p>
                </div>
              </div>

              {/* Recommendation Message */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Recommendation
                </h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    {selectedRecommendation.recommendationMessage}
                  </p>
                </div>
              </div>

              {/* Medicines */}
              {selectedRecommendation.items &&
                selectedRecommendation.items.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {selectedRecommendation.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-green-50 border border-green-200 rounded-lg p-3"
                        >
                          <p>
                            <strong>Medicine ID:</strong> {item.medicalId}
                          </p>
                          <p>
                            <strong>Frequency:</strong> {item.frequency}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Dates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Important Dates
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Created Date:</strong>{" "}
                    {formatDate(selectedRecommendation.createdDate)}
                  </p>
                  {selectedRecommendation.rescheduleAppointment && (
                    <p>
                      <strong>Reschedule Appointment:</strong>{" "}
                      {formatDate(selectedRecommendation.rescheduleAppointment)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRecommendationManagement;
