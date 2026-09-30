import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstancePatientService from "../../../utils/axiosInstancePatientService";

const HealthRecordList = ({ patientId, patientName }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchHealthRecords();
    }
  }, [patientId]);

  const fetchHealthRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstancePatientService.get(
        `/health-records/patient/${patientId}`
      );
      setHealthRecords(response.data);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast.error("Error fetching health records");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading health records...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Health Records {patientName && `for ${patientName}`}
      </h2>

      {healthRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No health records found for this patient.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {healthRecords.map((record, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                setSelectedRecord(selectedRecord === index ? null : index)
              }
            >
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-sm text-gray-500">Checkup Date</p>
                    <p className="font-medium">
                      {formatDate(record.checkupDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Height / Weight</p>
                    <p className="font-medium">
                      {record.heightInCm || "N/A"} cm /{" "}
                      {record.weightInKg || "N/A"} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="font-medium">
                      {record.bloodPressure || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-medium">
                      {record.bodyTemperature || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600 text-sm">
                    {selectedRecord === index ? "Hide Details" : "View Details"}
                  </span>
                </div>
              </div>

              {selectedRecord === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Vital Signs */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        Vital Signs
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Blood Sugar:</span>
                          <span className="font-medium">
                            {record.bloodSugar || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pulse Rate:</span>
                          <span className="font-medium">
                            {record.pulseRate || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-3">
                        Medical Conditions
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Diabetes:</span>
                          <span
                            className={`font-medium ${
                              record.hasDiabetes
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.hasDiabetes)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hypertension:</span>
                          <span
                            className={`font-medium ${
                              record.isHypertensive
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.isHypertensive)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Heart Disease:</span>
                          <span
                            className={`font-medium ${
                              record.hasHeartDisease
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.hasHeartDisease)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kidney Disease:</span>
                          <span
                            className={`font-medium ${
                              record.hasKidneyDisease
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.hasKidneyDisease)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liver Disease:</span>
                          <span
                            className={`font-medium ${
                              record.hasLiverDisease
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.hasLiverDisease)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle & Others */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">
                        Lifestyle & Others
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Smoker:</span>
                          <span
                            className={`font-medium ${
                              record.isSmoker
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.isSmoker)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alcoholic:</span>
                          <span
                            className={`font-medium ${
                              record.isAlcoholic
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatBoolean(record.isAlcoholic)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span
                            className={`font-medium ${
                              record.isActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatBoolean(record.isActive)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.allergies && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Allergies
                        </h5>
                        <p className="text-sm bg-yellow-50 p-3 rounded border">
                          {record.allergies}
                        </p>
                      </div>
                    )}
                    {record.pastSurgeries && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Past Surgeries
                        </h5>
                        <p className="text-sm bg-gray-50 p-3 rounded border">
                          {record.pastSurgeries}
                        </p>
                      </div>
                    )}
                    {record.physicalDisability && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Physical Disability
                        </h5>
                        <p className="text-sm bg-orange-50 p-3 rounded border">
                          {record.physicalDisability}
                        </p>
                      </div>
                    )}
                    {record.vaccineInfo && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Vaccine Information
                        </h5>
                        <p className="text-sm bg-blue-50 p-3 rounded border">
                          {record.vaccineInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecordList;
