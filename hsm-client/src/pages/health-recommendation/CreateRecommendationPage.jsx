import DoctorNavbar from "../../components/navbar/doctorNavbar";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import CreateHealthRecommendation from "../../components/health-recommendation/CreateHealthRecommendation";

const CreateRecommendationPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-56">
        <DoctorSidebar />
      </div>

      <div className="flex-1">
        <DoctorNavbar />
        <div className="p-6">
          <CreateHealthRecommendation />
        </div>
      </div>
    </div>
  );
};

export default CreateRecommendationPage;
