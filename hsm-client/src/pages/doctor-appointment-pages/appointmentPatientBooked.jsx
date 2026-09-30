// import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import Navbar from "../../components/navbar/Navbar";
import AppointmentPatientBooked from "../../components/doctor-appointment/appointmentPatientBooked";
import Sidebar from "../../components/sidebar/PatientSidebar";
const AppointmentPatientBookedPage = () => {
  return (
    <div className="flex min-h-screen bg-sky-50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="p-3 sm:p-6">
          <AppointmentPatientBooked />
        </div>
      </div>
    </div>
  );
};

export default AppointmentPatientBookedPage;
