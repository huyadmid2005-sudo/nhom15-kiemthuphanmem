import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstanceAppointmentService from "../../utils/axiosInstanceAppointmentService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import axiosInstanceDoctorService from "../../utils/axiosInstanceDoctorService";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaHospital,
  FaUserMd,
  FaFilter,
  FaTimes,
  FaExclamationTriangle,
  FaRedoAlt,
} from "react-icons/fa";

const AvailableAppointments = () => {
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [bookingAppointment, setBookingAppointment] = useState(null);
  const fetchedRef = useRef(false);

  // Filter states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    fetchPatientInfo(controller.signal);
    fetchAvailableAppointments(controller.signal);

    return () => controller.abort();
  }, []);

  // Filter appointments when filter values change
  useEffect(() => {
    filterAppointments();
  }, [availableAppointments, selectedDate, selectedDoctor, selectedDepartment]);

  const fetchPatientInfo = async (signal) => {
    try {
      const response = await axiosInstancePatientService.get("/profile", { signal });
      setPatientId(response.data.patientId);
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error("Error fetching patient info:", error);
    }
  };

  const fetchAvailableAppointments = async (signal) => {
    try {
      setLoading(true);
      setFetchError(false);
      const response = await axiosInstanceAppointmentService.get(
        "/get/all/availability/appointment",
        { signal }
      );

      // Fetch doctor details for each appointment
      const appointmentsWithDoctorDetails = await Promise.all(
        response.data.map(async (appointment) => {
          try {
            const doctorResponse = await axiosInstanceDoctorService.get(
              `/id/${appointment.doctorId}`,
              { signal }
            );
            return {
              ...appointment,
              doctorDetails: doctorResponse.data,
            };
          } catch (error) {
            if (error.name === "CanceledError") throw error;
            console.error(
              `Error fetching doctor details for doctor ${appointment.doctorId}:`,
              error
            );
            return {
              ...appointment,
              doctorDetails: null,
            };
          }
        })
      );

      setAvailableAppointments(appointmentsWithDoctorDetails);

      // Extract unique doctors and departments for filter options
      const uniqueDoctors = [];
      const uniqueDepartments = new Set();

      appointmentsWithDoctorDetails.forEach((appointment) => {
        if (appointment.doctorDetails) {
          const doctorFullName = `Dr. ${appointment.doctorDetails.firstName} ${appointment.doctorDetails.lastName}`;
          const doctorExists = uniqueDoctors.find(
            (doc) => doc.id === appointment.doctorDetails.doctorId
          );

          if (!doctorExists) {
            uniqueDoctors.push({
              id: appointment.doctorDetails.doctorId,
              name: doctorFullName,
              department: appointment.doctorDetails.department,
            });
          }

          if (appointment.doctorDetails.department) {
            uniqueDepartments.add(appointment.doctorDetails.department);
          }
        }
      });

      setDoctors(uniqueDoctors);
      setDepartments(Array.from(uniqueDepartments));
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error("Error fetching available appointments:", error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = useCallback(() => {
    let filtered = [...availableAppointments];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(
        (appointment) => appointment.date === selectedDate
      );
    }

    // Filter by doctor
    if (selectedDoctor) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.doctorDetails &&
          appointment.doctorDetails.doctorId === selectedDoctor
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.doctorDetails &&
          appointment.doctorDetails.department === selectedDepartment
      );
    }

    setFilteredAppointments(filtered);
  }, [availableAppointments, selectedDate, selectedDoctor, selectedDepartment]);

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedDoctor("");
    setSelectedDepartment("");
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBookAppointment = async (appointment, appointmentType) => {
    if (!patientId) {
      toast.error("Patient information not found");
      return;
    }

    try {
      setBookingAppointment(appointment.availabilityId);

      const bookingDetails = {
        availabilityId: appointment.availabilityId,
        patientId: patientId,
        appointmentType: appointmentType,
        appointmentStatus: "Booked",
      };

      await axiosInstanceAppointmentService.post("/book", bookingDetails);
      toast.success("Appointment booked successfully!");

      // Refresh the available appointments list
      fetchAvailableAppointments();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(
        error?.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setBookingAppointment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold flex items-center">
            <FaCalendarAlt className="mr-3" />
            Available Appointments
          </h1>
          <p className="mt-2 opacity-90">
            Book your appointment with available doctors
          </p>
        </div>

        <div className="p-6">
          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-blue-600">
                {filteredAppointments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {availableAppointments.length}
              </span>{" "}
              available appointments
              {(selectedDate || selectedDoctor || selectedDepartment) &&
                " (filtered)"}
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Filter Appointments
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaTimes className="mr-1" />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Doctor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Doctor
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedDate || selectedDoctor || selectedDepartment) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedDate && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Date: {new Date(selectedDate).toLocaleDateString()}
                    <button
                      onClick={() => setSelectedDate("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDoctor && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Doctor: {doctors.find((d) => d.id === selectedDoctor)?.name}
                    <button
                      onClick={() => setSelectedDoctor("")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDepartment && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Department: {selectedDepartment}
                    <button
                      onClick={() => setSelectedDepartment("")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {fetchError ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto text-6xl text-amber-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Unable to Load Appointments
              </h3>
              <p className="text-gray-500 mb-6">
                Something went wrong while fetching available appointments. Please try again.
              </p>
              <button
                onClick={() => fetchAvailableAppointments()}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <FaRedoAlt className="mr-2" />
                Retry
              </button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {availableAppointments.length === 0
                  ? "No Available Appointments"
                  : "No Appointments Match Your Filters"}
              </h3>
              <p className="text-gray-500">
                {availableAppointments.length === 0
                  ? "There are no available appointments at the moment. Please check back later."
                  : "Try adjusting your filters to find more appointments."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.availabilityId}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Doctor Information */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-blue-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {appointment.doctorDetails
                            ? `Dr. ${appointment.doctorDetails.firstName} ${appointment.doctorDetails.lastName}`
                            : `Doctor ID: ${appointment.doctorId}`}
                        </h3>
                        {appointment.doctorDetails && (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center mt-1">
                              <FaHospital className="mr-2" />
                              {appointment.doctorDetails.department}
                            </div>
                            <div className="flex items-center mt-1">
                              <FaUser className="mr-2" />
                              {appointment.doctorDetails.designation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-blue-500 mr-3" />
                        <span className="font-medium">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaClock className="text-green-500 mr-3" />
                        <span className="font-medium">
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </span>
                      </div>
                    </div>

                    {/* Booking Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          handleBookAppointment(appointment, "In_Person")
                        }
                        disabled={
                          bookingAppointment === appointment.availabilityId
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        {bookingAppointment === appointment.availabilityId ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FaUser className="mr-2" />
                            Book In-Person
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleBookAppointment(appointment, "Telemedicine")
                        }
                        disabled={
                          bookingAppointment === appointment.availabilityId
                        }
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        {bookingAppointment === appointment.availabilityId ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FaUser className="mr-2" />
                            Book Telemedicine
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableAppointments;
