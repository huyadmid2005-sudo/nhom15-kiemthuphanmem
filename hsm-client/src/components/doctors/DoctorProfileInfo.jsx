import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  UserCircleIcon,
  PencilIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import doctorProfileService from "../../services/doctorProfileService";

const DoctorProfileInfo = ({ onEditClick }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const data = await doctorProfileService.getCurrentDoctor();
      console.log("Doctor profile data:", data); // Debug log
      setDoctor(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch doctor profile");
      console.error("Error fetching doctor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return "N/A";
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  const getDepartmentDisplay = (department) => {
    if (!department) return "N/A";
    return department
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getDesignationDisplay = (designation) => {
    if (!designation) return "N/A";
    return designation
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <UserCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Profile
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchDoctorProfile}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center p-8">
        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No Profile Found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Unable to load doctor profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserCircleIcon className="h-8 w-8 text-white" />
            <h2 className="ml-3 text-xl font-semibold text-white">
              Doctor Profile
            </h2>
          </div>
          <button
            onClick={onEditClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Profile Picture and Name */}
          <div className="flex items-center space-x-4 md:col-span-2">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                Doctor ID: {doctor.doctorId}
              </p>
              <div className="flex items-center mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.isApproved || doctor.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doctor.isApproved || doctor.approved
                    ? "Approved"
                    : "Pending Approval"}
                </span>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.isActive || doctor.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doctor.isActive || doctor.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h4>

            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{doctor.email || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Phone Number
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.phoneNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">
                  {doctor.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h4>

            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Date of Birth
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(doctor.dateOfBirth)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Gender</p>
                <p className="text-sm text-gray-600">
                  {getGenderDisplay(doctor.gender)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Professional Information
            </h4>

            <div className="flex items-center space-x-3">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Career Title
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.careerTitle || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <HeartIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Department</p>
                <p className="text-sm text-gray-600">
                  {getDepartmentDisplay(doctor.department)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Designation</p>
                <p className="text-sm text-gray-600">
                  {getDesignationDisplay(doctor.designation)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Experience & Qualifications
            </h4>

            <div className="flex items-center space-x-3">
              <StarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Experience</p>
                <p className="text-sm text-gray-600">
                  {doctor.experienceYears
                    ? `${doctor.experienceYears} years`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Qualifications
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.qualifications || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <HeartIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Specialization
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.specialization || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DoctorProfileInfo.propTypes = {
  onEditClick: PropTypes.func.isRequired,
};

export default DoctorProfileInfo;
