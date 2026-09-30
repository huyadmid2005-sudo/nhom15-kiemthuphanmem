import HealthSupportChat from "../../components/health-support-chat/HealthSupportChat";
import Sidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";

const HealthSupportChatPage = () => {
  return (
    <div className="flex min-h-screen bg-sky-50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="mx-auto w-full max-w-5xl p-3 sm:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Trợ lý Sức khỏe AI
            </h1>
            <p className="text-gray-600">
              Nhận tư vấn sức khỏe thông minh dựa trên dữ liệu y tế của bạn
            </p>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            <HealthSupportChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSupportChatPage;
