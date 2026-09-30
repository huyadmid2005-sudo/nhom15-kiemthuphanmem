import DoctorNavbar from "../../components/navbar/doctorNavbar";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import EditHealthRecommendation from "../../components/health-recommendation/EditHealthRecommendation";

const EditRecommendationPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-56">
        <DoctorSidebar />
      </div>

      <div className="flex-1">
        <DoctorNavbar />
        <div className="p-6">
          <EditHealthRecommendation />
        </div>
      </div>
    </div>
  );
};

export default EditRecommendationPage;
