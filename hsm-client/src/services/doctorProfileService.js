import axiosInstanceDoctorService from "../utils/axiosInstanceDoctorService";

export const doctorProfileService = {
  // Get current doctor profile
  getCurrentDoctor: async () => {
    try {
      const response = await axiosInstanceDoctorService.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching current doctor:", error);
      throw error;
    }
  },

  // Update doctor profile
  updateDoctorProfile: async (doctorData) => {
    try {
      const response = await axiosInstanceDoctorService.put(
        "/profile/update",
        doctorData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      throw error;
    }
  },
};

export default doctorProfileService;
