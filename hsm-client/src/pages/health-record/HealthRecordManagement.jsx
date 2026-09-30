import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import PatientSearch from "../../components/patients/health-record/PatientSearch";
import "./health-record-management.scss";

const HealthRecordManagement = () => {
  return (
    <div className="health-record-page">
      <Sidebar />
      <div className="health-record-container">
        <Navbar />
        <div className="health-record-content">
          <h1 className="health-record-title">Health Record Management</h1>
          <PatientSearch />
        </div>
      </div>
    </div>
  );
};

export default HealthRecordManagement;
