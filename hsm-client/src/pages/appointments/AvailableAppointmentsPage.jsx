import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import AvailableAppointments from "../../components/appointments/AvailableAppointments";

const AvailableAppointmentsPage = () => {
  return (
    <div className="flex min-h-screen bg-sky-50">
      <PatientSidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="p-3 sm:p-6">
          <AvailableAppointments />
        </div>
      </div>
    </div>
  );
};

export default AvailableAppointmentsPage;
