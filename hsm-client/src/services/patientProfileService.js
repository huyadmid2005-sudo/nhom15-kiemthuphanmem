import axiosInstancePatientService from "../utils/axiosInstancePatientService";

export const patientProfileService = {
  // Get current patient profile
  getCurrentPatient: async () => {
    try {
      const response = await axiosInstancePatientService.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching current patient:", error);
      throw error;
    }
  },

  // Update patient profile
  updatePatientProfile: async (patientData) => {
    try {
      const response = await axiosInstancePatientService.put(
        "/profile/update",
        patientData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating patient profile:", error);
      throw error;
    }
  },
};

export default patientProfileService;
