import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstancePatientService from "../../../utils/axiosInstancePatientService";

const HealthRecordForm = ({ patientId, patientName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    checkupDate: new Date().toISOString().split("T")[0],
    heightInCm: "",
    weightInKg: "",
    bloodPressure: "",
    bloodSugar: "",
    bodyTemperature: "",
    pulseRate: "",
    allergies: "",
    pastSurgeries: "",
    hasDiabetes: false,
    isHypertensive: false,
    hasHeartDisease: false,
    hasKidneyDisease: false,
    hasLiverDisease: false,
    hasCancer: false,
    hasHiv: false,
    hasTb: false,
    physicalDisability: "",
    vaccineInfo: "",
    isSmoker: false,
    isAlcoholic: false,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientId) {
      setFormData((prev) => ({ ...prev, patientId }));
    }
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        heightInCm: formData.heightInCm ? parseInt(formData.heightInCm) : null,
        weightInKg: formData.weightInKg ? parseInt(formData.weightInKg) : null,
      };

      await axiosInstancePatientService.post(
        "/health-records/create",
        submitData
      );
      toast.success("Health record created successfully!");
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (error) {
      console.error("Error creating health record:", error);
      toast.error("Error creating health record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Health Record {patientName && `for ${patientName}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient ID and Checkup Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  readOnly={!!patientId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checkup Date
                </label>
                <input
                  type="date"
                  name="checkupDate"
                  value={formData.checkupDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Vital Signs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="heightInCm"
                    value={formData.heightInCm}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weightInKg"
                    value={formData.weightInKg}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    placeholder="120/80"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Sugar
                  </label>
                  <input
                    type="text"
                    name="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Temperature
                  </label>
                  <input
                    type="text"
                    name="bodyTemperature"
                    value={formData.bodyTemperature}
                    onChange={handleInputChange}
                    placeholder="36.5°C"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pulse Rate
                  </label>
                  <input
                    type="text"
                    name="pulseRate"
                    value={formData.pulseRate}
                    onChange={handleInputChange}
                    placeholder="72 bpm"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Medical History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Past Surgeries
                  </label>
                  <textarea
                    name="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "hasDiabetes", label: "Diabetes" },
                  { name: "isHypertensive", label: "Hypertension" },
                  { name: "hasHeartDisease", label: "Heart Disease" },
                  { name: "hasKidneyDisease", label: "Kidney Disease" },
                  { name: "hasLiverDisease", label: "Liver Disease" },
                  { name: "hasCancer", label: "Cancer" },
                  { name: "hasHiv", label: "HIV" },
                  { name: "hasTb", label: "Tuberculosis" },
                ].map((condition) => (
                  <div key={condition.name} className="flex items-center">
                    <input
                      type="checkbox"
                      name={condition.name}
                      checked={formData[condition.name]}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      {condition.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Disability
                  </label>
                  <input
                    type="text"
                    name="physicalDisability"
                    value={formData.physicalDisability}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccine Information
                  </label>
                  <input
                    type="text"
                    name="vaccineInfo"
                    value={formData.vaccineInfo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSmoker"
                    checked={formData.isSmoker}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Smoker</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAlcoholic"
                    checked={formData.isAlcoholic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Alcoholic
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Health Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordForm;
