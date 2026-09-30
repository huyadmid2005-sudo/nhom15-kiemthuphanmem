import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstancePatientService from "../../../utils/axiosInstancePatientService";
import HealthRecordForm from "./HealthRecordForm";

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHealthRecordForm, setShowHealthRecordForm] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning("Please enter a patient name to search");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstancePatientService.get(
        `/search/${searchTerm.trim()}`
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info("No patients found with that name");
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("Error searching patients. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddHealthRecord = (patient) => {
    setSelectedPatient(patient);
    setShowHealthRecordForm(true);
  };

  const handleCloseForm = () => {
    setShowHealthRecordForm(false);
    setSelectedPatient(null);
  };

  const handleFormSuccess = () => {
    // Optionally refresh search results or show success message
    toast.success("Health record added successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Search Patient & Add Health Record
      </h2>

      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter patient name to search..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Search Results ({searchResults.length} patients found)
          </h3>

          <div className="grid gap-4">
            {searchResults.map((patient) => (
              <div
                key={patient.patientId}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-medium">{patient.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{patient.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{patient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">{patient.bloodGroup}</p>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleAddHealthRecord(patient)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-sm font-medium"
                    >
                      Add Health Record
                    </button>
                  </div>
                </div>

                {patient.address && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm">{patient.address}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {searchTerm && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          <p>No patients found. Try searching with a different name.</p>
        </div>
      )}

      {/* Health Record Form Modal */}
      {showHealthRecordForm && selectedPatient && (
        <HealthRecordForm
          patientId={selectedPatient.patientId}
          patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default PatientSearch;
