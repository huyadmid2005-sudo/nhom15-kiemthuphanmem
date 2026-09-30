import { useState } from "react";
import DoctorProfileInfo from "../../components/doctors/DoctorProfileInfo";
import DoctorProfileEdit from "../../components/doctors/DoctorProfileEdit";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import Navbar from "../../components/navbar/Navbar";

const DoctorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optionally refresh the profile data here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-lg">
        <DoctorSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {isEditing ? (
              <DoctorProfileEdit onCancel={handleCancel} onSave={handleSave} />
            ) : (
              <DoctorProfileInfo onEditClick={handleEditClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
