import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstanceCDSSService from "../../utils/axiosInstanceCDSSService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import axiosInstanceInventoryService from "../../utils/axiosInstanceInventoryService";
import {
  FaUser,
  FaPills,
  FaCalendarAlt,
  FaTrash,
  FaPlus,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";

const EditHealthRecommendation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [searchMedicine, setSearchMedicine] = useState("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await axiosInstanceCDSSService.get(
          `/from-doctor/get/byId/${id}`
        );
        const recommendation = response.data;

        setSelectedPatient(recommendation.patientId?.toString() || "");
        setRecommendationMessage(recommendation.recommendationMessage || "");
        setRescheduleDate(
          recommendation.rescheduleAppointment
            ? new Date(recommendation.rescheduleAppointment)
                .toISOString()
                .split("T")[0]
            : ""
        );
        setPrescribedMedicines(recommendation.items || []);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        toast.error("Failed to fetch recommendation details");
        navigate("/doctor/health-recommendations");
      }
    };

    const initializeData = async () => {
      await Promise.all([
        fetchRecommendation(),
        fetchPatients(),
        fetchMedicines(),
      ]);
    };
    initializeData();
  }, [id, navigate]);

  const fetchRecommendation = async () => {
    try {
      const response = await axiosInstanceCDSSService.get(
        `/from-doctor/get/byId/${id}`
      );
      const recommendation = response.data;

      setSelectedPatient(recommendation.patientId?.toString() || "");
      setRecommendationMessage(recommendation.recommendationMessage || "");
      setRescheduleDate(
        recommendation.rescheduleAppointment
          ? new Date(recommendation.rescheduleAppointment)
              .toISOString()
              .split("T")[0]
          : ""
      );
      setPrescribedMedicines(recommendation.items || []);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      toast.error("Failed to fetch recommendation details");
      navigate("/doctor/health-recommendations");
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axiosInstancePatientService.get("/all");
      console.log("Patients API response (edit):", response.data);
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await axiosInstanceInventoryService.get(
        "/medicine/get-all"
      );
      setMedicines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = (medicine) => {
    const isAlreadyAdded = prescribedMedicines.some(
      (item) => item.medicalId === medicine.id
    );

    if (isAlreadyAdded) {
      toast.warning("This medicine is already added");
      return;
    }

    const newMedicine = {
      medicalId: medicine.id,
      medicineName: medicine.medicineName,
      frequency: "Once daily",
    };

    setPrescribedMedicines((prev) => [...prev, newMedicine]);
    setShowMedicineModal(false);
    setSearchMedicine("");
    toast.success(`${medicine.medicineName} added successfully`);
  };

  const handleRemoveMedicine = (medicalId) => {
    setPrescribedMedicines((prev) =>
      prev.filter((item) => item.medicalId !== medicalId)
    );
    toast.success("Medicine removed successfully");
  };

  const handleFrequencyChange = (medicalId, frequency) => {
    setPrescribedMedicines((prev) =>
      prev.map((item) =>
        item.medicalId === medicalId ? { ...item, frequency } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    if (!recommendationMessage.trim()) {
      toast.error("Please enter a recommendation message");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        patientId: selectedPatient, // Keep as string since API expects "00-00002" format
        recommendationMessage: recommendationMessage.trim(),
        rescheduleAppointment: rescheduleDate || null,
        items: prescribedMedicines.map((med) => ({
          medicalId: parseInt(med.medicalId),
          frequency: med.frequency,
        })),
      };

      await axiosInstanceCDSSService.put(`/from-doctor/edit/${id}`, payload);

      toast.success("Health recommendation updated successfully!");
      navigate("/doctor/health-recommendations");
    } catch (error) {
      console.error("Error updating recommendation:", error);
      toast.error(
        error.response?.data?.message || "Failed to update recommendation"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicineName?.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate("/doctor/health-recommendations")}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Health Recommendation
          </h1>
          <p className="text-gray-600">Update patient health recommendation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FaUser className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Patient Information</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a patient</option>
              {patients.map((patient) => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.firstName} {patient.lastName} - ID:{" "}
                  {patient.patientId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendation Message */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Health Recommendation</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendation Message *
            </label>
            <textarea
              value={recommendationMessage}
              onChange={(e) => setRecommendationMessage(e.target.value)}
              placeholder="Enter detailed health recommendation for the patient..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              required
            />
          </div>
        </div>

        {/* Medicine Prescription */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaPills className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold">Medicine Prescription</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowMedicineModal(true)}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>

          {prescribedMedicines.length > 0 ? (
            <div className="space-y-3">
              {prescribedMedicines.map((medicine, index) => (
                <div
                  key={`${medicine.medicalId}-${index}`}
                  className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {medicine.medicineName ||
                        `Medicine ID: ${medicine.medicalId}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {medicine.medicalId}
                    </p>
                  </div>

                  <div className="w-48">
                    <select
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleFrequencyChange(
                          medicine.medicalId,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(medicine.medicalId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaPills className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No medicines prescribed yet</p>
              <p className="text-sm">
                Click &quot;Add Medicine&quot; to prescribe medications
              </p>
            </div>
          )}
        </div>

        {/* Reschedule Appointment */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FaCalendarAlt className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Appointment Date (Optional)
            </label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/doctor/health-recommendations")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <FaSave className="w-4 h-4" />
            <span>{saving ? "Updating..." : "Update Recommendation"}</span>
          </button>
        </div>
      </form>

      {/* Medicine Selection Modal */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Medicine</h3>
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    onClick={() => handleAddMedicine(medicine)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-gray-900">
                      {medicine.medicineName}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {medicine.id} | Stock: {medicine.quantity} | Type:{" "}
                      {medicine.medicineType}
                    </p>
                  </div>
                ))}

                {filteredMedicines.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No medicines found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHealthRecommendation;
