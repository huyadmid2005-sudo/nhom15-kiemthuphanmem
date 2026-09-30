import { useState } from "react";
import PatientProfileInfo from "./PatientProfileInfo";
import PatientProfileEdit from "./PatientProfileEdit";

const PatientProfile = () => {
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
        <PatientProfileEdit onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <PatientProfileInfo onEditClick={handleEditClick} />
      )}
    </div>
  );
};

export default PatientProfile;
