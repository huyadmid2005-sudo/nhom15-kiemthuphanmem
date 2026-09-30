import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import ResearcherManagement from "../../components/analytics/ResearcherManagement";
import "../list/list.scss";

const AnalyticsManagement = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <ResearcherManagement />
      </div>
    </div>
  );
};

export default AnalyticsManagement;
