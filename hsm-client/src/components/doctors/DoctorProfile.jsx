import { useState } from "react";
import DoctorProfileInfo from "./DoctorProfileInfo";
import DoctorProfileEdit from "./DoctorProfileEdit";

const DoctorProfile = () => {
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
    <div className="max-w-4xl mx-auto">
      {isEditing ? (
        <DoctorProfileEdit onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <DoctorProfileInfo onEditClick={handleEditClick} />
      )}
    </div>
  );
};

export default DoctorProfile;
