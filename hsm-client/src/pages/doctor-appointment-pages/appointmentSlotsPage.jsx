import React from "react";
// Import your components
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import Navbar from "../../components/navbar/Navbar";
import AppointmentSlots from "../../components/doctor-appointment/appointmentSlots";

const AppointmentSlotsPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-56">
        {" "}
        <DoctorSidebar />
      </div>

      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          {" "}
          <AppointmentSlots />
        </div>
      </div>
    </div>
  );
};

export default AppointmentSlotsPage;
