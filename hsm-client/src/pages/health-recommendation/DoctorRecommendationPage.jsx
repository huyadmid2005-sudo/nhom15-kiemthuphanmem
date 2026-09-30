import DoctorNavbar from "../../components/navbar/doctorNavbar";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import DoctorRecommendationManagement from "../../components/health-recommendation/DoctorRecommendationManagement";

const DoctorRecommendationPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-56">
        <DoctorSidebar />
      </div>

      <div className="flex-1">
        <DoctorNavbar />
        <div className="p-6">
          <DoctorRecommendationManagement />
        </div>
      </div>
    </div>
  );
};

export default DoctorRecommendationPage;
