import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axiosInstanceCDSSService from "../../utils/axiosInstanceCDSSService";
import axiosInstanceInventoryService from "../../utils/axiosInstanceInventoryService";
import axiosInstanceDoctorService from "../../utils/axiosInstanceDoctorService";
import {
  HeartIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const priorityStyles = {
  high: {
    label: "High",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    panel: "border-l-rose-500 bg-rose-50",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Medium",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-l-amber-500 bg-amber-50",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-l-emerald-500 bg-emerald-50",
    dot: "bg-emerald-500",
  },
};

const formatDate = (value) => {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
};

const HealthRecommendation = ({ patientId, appointmentId }) => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [recommendations, setRecommendations] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const recommendationsResponse = await axiosInstanceCDSSService.get(
          "/from-doctor/get/byPatient"
        );
        const recommendationsData = recommendationsResponse.data || [];

        const enrichedRecommendations = await Promise.all(
          recommendationsData.map(async (rec) => {
            const medicines = [];
            let doctorInfo = {
              name: "Unknown",
              specialty: "General Practitioner",
            };

            if (rec.doctorId) {
              try {
                const doctorResponse = await axiosInstanceDoctorService.get(
                  `/id/${rec.doctorId}`
                );
                const doctor = doctorResponse.data;
                doctorInfo = {
                  name: `${doctor.firstName} ${doctor.lastName}`,
                  specialty: doctor.specialty || "General Practitioner",
                };
              } catch (error) {
                console.error(`Error fetching doctor ${rec.doctorId}:`, error);
              }
            }

            if (rec.items && rec.items.length > 0) {
              for (const item of rec.items) {
                try {
                  const medicineResponse =
                    await axiosInstanceInventoryService.get(
                      `/medicine/get/${item.medicalId}`
                    );
                  const medicine = medicineResponse.data;
                  medicines.push(
                    `${medicine.medicineName} - ${item.frequency}`
                  );
                } catch (error) {
                  console.error(
                    `Error fetching medicine ${item.medicalId}:`,
                    error
                  );
                  medicines.push(
                    `Medicine ID: ${item.medicalId} - ${item.frequency}`
                  );
                }
              }
            }

            return {
              id: rec.id,
              doctorName: `Dr. ${doctorInfo.name}`,
              specialty: doctorInfo.specialty,
              date: formatDate(rec.createdDate),
              priority: (rec.priority || "medium").toLowerCase(),
              title: "Health Recommendation",
              content: rec.recommendationMessage,
              medications: medicines,
              followUp: rec.rescheduleAppointment
                ? formatDate(rec.rescheduleAppointment)
                : null,
            };
          })
        );

        setRecommendations(enrichedRecommendations);
        setHealthRecords([
          {
            id: 1,
            date: new Date().toLocaleDateString(),
            type: "Last Check-up",
            value: "Normal",
            status: "normal",
            doctor: "Healthcare Team",
          },
        ]);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error("Failed to fetch health recommendations");
        setRecommendations([]);
        setHealthRecords([]);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchRecommendations();
      return;
    }

    setLoading(false);
    setRecommendations([]);
    setHealthRecords([]);
  }, [patientId, appointmentId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "high":
        return <ExclamationTriangleIcon className="h-5 w-5 text-rose-500" />;
      case "normal":
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case "low":
        return <InformationCircleIcon className="h-5 w-5 text-sky-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-98px)] bg-sky-50 px-3 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-5">
          <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 h-12 w-2/3 rounded-2xl bg-slate-200 sm:w-1/3" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-98px)] bg-sky-50 px-3 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-sm sm:h-16 sm:w-16">
                <HeartSolid className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-600">
                  Patient Care
                </p>
                <h1 className="break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Health Recommendations
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Doctor guidance, prescribed medicine notes, and follow-up
                  details are grouped here for easier review.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={() => setActiveTab("recommendations")}
                aria-pressed={activeTab === "recommendations"}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  activeTab === "recommendations"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                Recommendations
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("records")}
                aria-pressed={activeTab === "records"}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  activeTab === "records"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                Health Records
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
                Total Advice
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {recommendations.length}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                Context
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                From doctor recommendations and saved health data.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Reminder
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                Contact a doctor if symptoms persist or become severe.
              </p>
            </div>
          </div>
        </section>

        {activeTab === "recommendations" && (
          <section className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => {
                const priority =
                  priorityStyles[rec.priority] || priorityStyles.medium;

                return (
                  <article
                    key={rec.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className={`border-l-4 p-4 ${priority.panel}`}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white bg-white text-slate-600 shadow-sm">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="break-words font-semibold text-slate-950">
                              {rec.doctorName}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {rec.specialty}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${priority.badge}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${priority.dot}`}
                            />
                            {priority.label}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-500">
                            <ClockIcon className="h-4 w-4" />
                            {rec.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                      <div>
                        <h4 className="text-xl font-bold text-slate-950">
                          {rec.title}
                        </h4>
                        <p className="mt-3 break-words text-slate-700 leading-7">
                          {rec.content || "No recommendation content provided."}
                        </p>
                      </div>

                      {rec.medications && rec.medications.length > 0 && (
                        <div>
                          <h5 className="mb-3 font-semibold text-slate-950">
                            Prescribed medicines
                          </h5>
                          <ul className="space-y-2">
                            {rec.medications.map((med, index) => (
                              <li
                                key={index}
                                className="flex min-w-0 items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-700"
                              >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                                <span className="min-w-0 flex-1 break-words">
                                  {med}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.followUp && (
                        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm font-semibold text-sky-900">
                          Follow-up appointment: {rec.followUp}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-sky-500">
                  <HeartIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">
                  No Health Recommendations
                </h3>
                <p className="mt-2 text-slate-600">
                  No health recommendations are available for this patient yet.
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === "records" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-xl font-bold text-slate-950">
              Health Records
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {healthRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-slate-950">
                      {record.type}
                    </h4>
                    {getStatusIcon(record.status)}
                  </div>
                  <p className="text-2xl font-bold text-slate-950">
                    {record.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Doctor: {record.doctor}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{record.date}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-6">
              <h4 className="text-lg font-semibold text-slate-950">
                Health Trends
              </h4>
              <div className="mt-4 flex min-h-48 items-center justify-center rounded-2xl border border-sky-100 bg-white p-6 text-center text-sm text-slate-500">
                Chart data will appear here when enough health records are
                available.
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

HealthRecommendation.propTypes = {
  patientId: PropTypes.string,
  appointmentId: PropTypes.string,
};

export default HealthRecommendation;
