import { useState, useEffect } from "react";
import axiosInstanceAppointmentService from "../../utils/axiosInstanceAppointmentService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import axiosInstanceDoctorService from "../../utils/axiosInstanceDoctorService";
import AppointmentHealthRecommendation from "../appointments/AppointmentHealthRecommendation";
import { FaHeart } from "react-icons/fa";

const AppointmentPatientBooked = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showHealthRecommendation, setShowHealthRecommendation] =
    useState(false);

  //   useEffect(() => {
  //     axiosInstancePatientService
  //       .get("/profile")
  //       .then((response) => {
  //         const patientId = response.data.patientId;

  //         return axiosInstanceAppointmentService.get(
  //           `/get/all/patient/${patientId}`,
  //         );
  //       })
  //       .then((response) => {
  //         setAppointments(response.data);
  //       })
  //       .catch((error) => console.error("Error fetching appointments", error));
  //   }, []);

  useEffect(() => {
    axiosInstancePatientService
      .get("/profile")
      .then((response) => {
        const patientId = response.data.patientId;
        return axiosInstanceAppointmentService.get(
          `/get/all/patient/${patientId}`
        );
      })
      .then(async (response) => {
        const appointmentsWithDoctorDetails = await Promise.all(
          response.data.map(async (appointment) => {
            const doctorResponse = await axiosInstanceDoctorService.get(
              `/id/${appointment.appointment.doctorId}`
            );
            return {
              ...appointment,
              doctorDetails: doctorResponse.data,
            };
          })
        );
        setAppointments(appointmentsWithDoctorDetails);
      })
      .catch((error) => console.error("Error fetching appointments", error));
  }, []);

  const formatTime = (time) => {
    const [hour, minutes] = time.split(":");
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12; // Convert "00" to "12"
    return `${formattedHour}:${minutes} ${isPM ? "PM" : "AM"}`;
  };

  const isAppointmentExpired = (date, endTime) => {
    const appointmentDateTime = new Date(`${date}T${endTime}`);
    const currentDateTime = new Date();
    return currentDateTime > appointmentDateTime;
  };

  const getAppointmentStatus = (appointment) => {
    const expired = isAppointmentExpired(
      appointment.doctorAvailability.date,
      appointment.doctorAvailability.endTime
    );

    if (expired) {
      return "Hết thời gian";
    }

    return appointment.appointment.appointmentStatus;
  };

  const getStatusColor = (appointment) => {
    const expired = isAppointmentExpired(
      appointment.doctorAvailability.date,
      appointment.doctorAvailability.endTime
    );

    if (expired) {
      return "text-red-600 font-semibold";
    }

    switch (appointment.appointment.appointmentStatus) {
      case "Booked":
        return "text-green-600 font-semibold";
      case "Completed":
        return "text-blue-600 font-semibold";
      case "Cancelled":
        return "text-gray-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const handleJoinTelemedicine = (patientId) => {
    window.open(`/room/${patientId}`, "_blank");
  };

  const handleViewHealthRecommendation = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthRecommendation(true);
  };

  const handleCloseHealthRecommendation = () => {
    setShowHealthRecommendation(false);
    setSelectedAppointment(null);
  };

  //   return (
  //     <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-5">
  //       <table className="w-full text-sm text-left text-gray-500">
  //         <thead className="text-xs uppercase bg-gray-700 text-white">
  //           <tr>
  //             <th scope="col" className="py-3 px-6">
  //               Appointment ID
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Doctor ID
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Date
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Time
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Type
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Status
  //             </th>
  //             <th scope="col" className="py-3 px-6">
  //               Action
  //             </th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {appointments.map((appointment) => {
  //             const startTime = formatTime(
  //               appointment.doctorAvailability.startTime,
  //             );
  //             const endTime = formatTime(appointment.doctorAvailability.endTime);
  //             const isTelemedicine =
  //               appointment.appointment.appointmentType === "Telemedicine";
  //             const isBooked =
  //               appointment.appointment.appointmentStatus === "Booked";

  //             return (
  //               <tr
  //                 className="bg-white border-b"
  //                 key={appointment.appointment.appointmentId}
  //               >
  //                 <td className="py-4 px-6">
  //                   {appointment.appointment.appointmentId}
  //                 </td>
  //                 <td className="py-4 px-6">
  //                   {appointment.appointment.doctorId}
  //                 </td>
  //                 <td className="py-4 px-6">
  //                   {appointment.doctorAvailability.date}
  //                 </td>
  //                 <td className="py-4 px-6">
  //                   {startTime} - {endTime}
  //                 </td>
  //                 <td className="py-4 px-6">
  //                   {appointment.appointment.appointmentType}
  //                 </td>
  //                 <td className="py-4 px-6">
  //                   {appointment.appointment.appointmentStatus}
  //                 </td>
  //                 <td className="py-4 px-6 text-center">
  //                   {isTelemedicine && isBooked ? (
  //                     <button
  //                       onClick={() =>
  //                         handleJoinTelemedicine(
  //                           appointment.appointment.patientId,
  //                         )
  //                       }
  //                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //                     >
  //                       Join Telemedicine
  //                     </button>
  //                   ) : (
  //                     <span className="text-gray-500">N/A</span>
  //                   )}
  //                 </td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>
  //   );

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-5">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase bg-gray-700 text-white">
          <tr>
            <th scope="col" className="py-3 px-6">
              Doctor Name
            </th>
            <th scope="col" className="py-3 px-6">
              Department
            </th>
            <th scope="col" className="py-3 px-6">
              Designation
            </th>
            <th scope="col" className="py-3 px-6">
              Date
            </th>
            <th scope="col" className="py-3 px-6">
              Time
            </th>
            <th scope="col" className="py-3 px-6">
              Type
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
            <th scope="col" className="py-3 px-6">
              Health Recommendation
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const doctor = appointment.doctorDetails;
            const startTime = formatTime(
              appointment.doctorAvailability.startTime
            );
            const endTime = formatTime(appointment.doctorAvailability.endTime);
            const isTelemedicine =
              appointment.appointment.appointmentType === "Telemedicine";
            const isBooked =
              appointment.appointment.appointmentStatus === "Booked";
            const expired = isAppointmentExpired(
              appointment.doctorAvailability.date,
              appointment.doctorAvailability.endTime
            );

            return (
              <tr
                className="bg-white border-b"
                key={appointment.appointment.appointmentId}
              >
                <td className="py-4 px-6">
                  {doctor.firstName + " " + doctor.lastName}
                </td>
                <td className="py-4 px-6">{doctor.department}</td>
                <td className="py-4 px-6">{doctor.designation}</td>
                <td className="py-4 px-6">
                  {appointment.doctorAvailability.date}
                </td>
                <td className="py-4 px-6">
                  {startTime} - {endTime}
                </td>
                <td className="py-4 px-6">
                  {appointment.appointment.appointmentType}
                </td>
                <td className={`py-4 px-6 ${getStatusColor(appointment)}`}>
                  {getAppointmentStatus(appointment)}
                </td>
                <td className="py-4 px-6 text-center">
                  {isTelemedicine && isBooked && !expired ? (
                    <button
                      onClick={() =>
                        handleJoinTelemedicine(
                          appointment.appointment.patientId
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Join Telemedicine
                    </button>
                  ) : expired ? (
                    <span className="text-red-500 font-semibold">
                      Đã hết hạn
                    </span>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleViewHealthRecommendation(appointment)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-1"
                  >
                    <FaHeart className="w-4 h-4" />
                    <span>Health Tips</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Health Recommendation Modal */}
      {showHealthRecommendation && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Health Recommendation
              </h2>
              <button
                onClick={handleCloseHealthRecommendation}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <AppointmentHealthRecommendation
                appointmentId={selectedAppointment.appointment.appointmentId}
                doctorId={selectedAppointment.appointment.doctorId}
                patientId={selectedAppointment.appointment.patientId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPatientBooked;
