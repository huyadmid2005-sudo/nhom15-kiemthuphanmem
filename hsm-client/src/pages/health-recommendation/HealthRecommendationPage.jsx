import { useEffect, useState } from "react";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import HealthRecommendation from "../../components/appointments/HealthRecommendation";

const HealthRecommendationPage = () => {
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    // Get patient ID from localStorage or current user session
    const storedPatientId =
      localStorage.getItem("patientId") || localStorage.getItem("userId");
    setPatientId(storedPatientId);
  }, []);

  return (
    <div className="flex min-h-screen bg-sky-50">
      <PatientSidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <HealthRecommendation patientId={patientId} />
      </div>
    </div>
  );
};

export default HealthRecommendationPage;
