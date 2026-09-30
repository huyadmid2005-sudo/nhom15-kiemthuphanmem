import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstanceCDSSService from "../../utils/axiosInstanceCDSSService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import axiosInstanceInventoryService from "../../utils/axiosInstanceInventoryService";
import {
  FaPlus,
  FaTimes,
  FaUser,
  FaPills,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";

const CreateHealthRecommendation = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    recommendationMessage: "",
    rescheduleAppointment: "",
    items: [],
  });

  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [searchMedicine, setSearchMedicine] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchMedicines();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axiosInstancePatientService.get("/all");
      console.log("Patients API response:", response.data);
      setPatients(response.data || []);
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
      setMedicines(response.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to fetch medicines");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input change:", name, "=", value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMedicineItem = (medicine) => {
    const newItem = {
      medicalId: medicine.medicineId || medicine.id,
      medicineName: medicine.medicineName,
      frequency: "1 times per day",
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setShowMedicineModal(false);
    setSearchMedicine("");
  };

  const removeMedicineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateMedicineFrequency = (index, frequency) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, frequency } : item
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      toast.error("Please select a patient");
      return;
    }

    if (!formData.recommendationMessage.trim()) {
      toast.error("Please enter recommendation message");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        patientId: formData.patientId, // Keep as string since API expects "00-00002" format
        recommendationMessage: formData.recommendationMessage,
        rescheduleAppointment: formData.rescheduleAppointment || null,
        items: formData.items.map((item) => ({
          medicalId: parseInt(item.medicalId),
          frequency: item.frequency,
        })),
      };

      console.log("Submitting recommendation:", submitData);

      await axiosInstanceCDSSService.post("/from-doctor/create", submitData);
      toast.success("Health recommendation created successfully!");

      // Reset form
      setFormData({
        patientId: "",
        recommendationMessage: "",
        rescheduleAppointment: "",
        items: [],
      });
    } catch (error) {
      console.error("Error creating recommendation:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create recommendation"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const medicineName = med.medicineName?.toLowerCase().trim() || "";
    const search = searchMedicine.toLowerCase().trim();
    return medicineName.includes(search);
  });

  const frequencyOptions = [
    "1 time per day",
    "2 times per day",
    "3 times per day",
    "Once daily",
    "Twice daily",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
            <FaUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Health Recommendation
            </h1>
            <p className="text-gray-600">
              Provide health recommendations and prescriptions for patients
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline w-4 h-4 mr-2" />
              Select Patient *
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient) => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.firstName} {patient.lastName} - ID:{" "}
                  {patient.patientId}
                </option>
              ))}
            </select>
          </div>

          {/* Recommendation Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Recommendation *
            </label>
            <textarea
              name="recommendationMessage"
              value={formData.recommendationMessage}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter detailed health recommendations for the patient..."
              required
            />
          </div>

          {/* Medicines Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <FaPills className="inline w-4 h-4 mr-2" />
                Prescribed Medicines
              </label>
              <button
                type="button"
                onClick={() => setShowMedicineModal(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>

            {formData.items.length > 0 ? (
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.medicineName}
                        </h4>
                        <div className="mt-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            Frequency:
                          </label>
                          <select
                            value={item.frequency}
                            onChange={(e) =>
                              updateMedicineFrequency(index, e.target.value)
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          >
                            {frequencyOptions.map((freq) => (
                              <option key={freq} value={freq}>
                                {freq}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedicineItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                No medicines added yet. Click &quot;Add Medicine&quot; to
                prescribe medications.
              </div>
            )}
          </div>

          {/* Reschedule Appointment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline w-4 h-4 mr-2" />
              Reschedule Appointment (Optional)
            </label>
            <input
              type="date"
              name="rescheduleAppointment"
              value={formData.rescheduleAppointment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <FaSave className="w-4 h-4" />
              <span>{loading ? "Creating..." : "Create Recommendation"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Medicine Selection Modal */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Medicine</h3>
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              />

              <div className="max-h-96 overflow-y-auto">
                {filteredMedicines.length > 0 ? (
                  <div className="space-y-2">
                    {filteredMedicines.map((medicine) => (
                      <button
                        key={medicine.medicineId || medicine.id}
                        onClick={() => addMedicineItem(medicine)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">
                          {medicine.medicineName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Type: {medicine.medicineType} | Stock:{" "}
                          {medicine.quantity} | Expiry: {medicine.expiryDate}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No medicines found
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

export default CreateHealthRecommendation;
