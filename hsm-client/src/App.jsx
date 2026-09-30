import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "./contexts/LanguageContext";

import AppointmentSlotsPage from "./pages/doctor-appointment-pages/appointmentSlotsPage";
import AppointmentCreate from "./pages/doctor-appointment-pages/appointmentCreate";
import AppointmentBooked from "./pages/doctor-appointment-pages/appointmentBooked";
import PatientDoctorList from "./pages/list/patientDoctorList";
import PatientDoctorProfileWithAppointment from "./pages/single/patientDoctorProfileWithAppointment";
import AppointmentPatientBookedPage from "./pages/doctor-appointment-pages/appointmentPatientBooked";
import RoomPage from "./pages/room-page/roomPage";
import PatientHomePage from "./pages/home/PatientHomePage";
import DoctorHomePage from "./pages/home/DoctorHomePage";
import AdminAddDoctor from "./pages/list/AdminAddDoctor";
import Authenticate from "./Authenticate";
import DoctorPatientsList from "./pages/list/doctorPatientList";
import DoctorPatientSingle from "./pages/single/DoctorPatientSingle";
import AdminDoctorList from "./pages/list/adminDoctorList";
import AdminDoctorSingle from "./pages/single/AdminDoctorSingle";
import MedicineManagement from "./pages/inventory/MedicineManagement";
import MedicalEquipmentManagement from "./pages/inventory/MedicalEquipmentManagement";
import ExpiryAlerts from "./pages/inventory/ExpiryAlerts";
import HealthRecordManagement from "./pages/health-record/HealthRecordManagement";
import LandingPage from "./pages/landing/LandingPage";
import AnalyticsManagement from "./pages/analytics/AnalyticsManagement";
import ResearcherRegistration from "./pages/researcher/ResearcherRegistration";
import HealthRecommendationPage from "./pages/health-recommendation/HealthRecommendationPage";
import DoctorRecommendationPage from "./pages/health-recommendation/DoctorRecommendationPage";
import CreateRecommendationPage from "./pages/health-recommendation/CreateRecommendationPage";
import EditRecommendationPage from "./pages/health-recommendation/EditRecommendationPage";
import RoomManagement from "./pages/room-management/RoomManagement";
import DoctorArticlesPage from "./pages/articles/DoctorArticlesPage";
import CreateArticlePage from "./pages/articles/CreateArticlePage";
import EditArticlePage from "./pages/articles/EditArticlePage";
import PatientArticlesPage from "./pages/articles/PatientArticlesPage";
import ArticleDetailPage from "./pages/articles/ArticleDetailPage";
import BookmarkedArticlesPage from "./pages/articles/BookmarkedArticlesPage";
import PatientProfilePage from "./pages/patient-profile/PatientProfilePage";
import DoctorProfilePage from "./pages/doctor-profile/DoctorProfilePage";
import ChangePasswordPage from "./pages/login/ChangePasswordPage";
import HealthSupportChatPage from "./pages/health-support-chat/HealthSupportChatPage";
import HealthSupportChatWidget from "./components/health-support-chat/HealthSupportChatWidget";
import AvailableAppointmentsPage from "./pages/appointments/AvailableAppointmentsPage";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route
                path="room/:roomId"
                element={<RoomPage key={window.location.pathname} />}
              />
              <Route path="login" element={<Login />} />
              <Route path="ChangePassword" element={<ChangePasswordPage />} />
              <Route path="patient/register" element={<Login />} />

              <Route
                path="researcher/register"
                element={<ResearcherRegistration />}
              />

              <Route index element={<LandingPage />} />
              <Route path="dashboard" element={<Home />} />

              <Route element={<Authenticate requiredRole={"Patient"} />}>
                <Route path="patient">
                  <Route index element={<List />} />
                  <Route path="home" element={<PatientHomePage />} />
                  <Route path="dashboard" element={<PatientHomePage />} />
                  <Route path="profile" element={<PatientProfilePage />} />
                  <Route path=":patientId" element={<Single />} />
                  <Route path="new" element={<New />} />
                  <Route path="doctor/all" element={<PatientDoctorList />} />
                  <Route
                    path="appointment/available"
                    element={<AvailableAppointmentsPage />}
                  />
                  <Route
                    path="appointment/all"
                    element={<AppointmentPatientBookedPage />}
                  />
                  <Route
                    path="health-recommendation"
                    element={<HealthRecommendationPage />}
                  />
                  <Route
                    path="health-support-chat"
                    element={<HealthSupportChatPage />}
                  />
                  <Route
                    path="doctor/:doctorId"
                    element={<PatientDoctorProfileWithAppointment />}
                  />
                  <Route path="doctor/list" element={<List />} />
                  <Route path="doctor/:doctorId" element={<Single />} />
                  {/* Patient Articles Routes */}
                  <Route path="articles" element={<PatientArticlesPage />} />
                  <Route
                    path="articles/bookmarks"
                    element={<BookmarkedArticlesPage />}
                  />
                  <Route
                    path="articles/:articleId"
                    element={<ArticleDetailPage />}
                  />
                </Route>
              </Route>

              <Route element={<Authenticate requiredRole={"Doctor"} />}>
                <Route path="doctor">
                  <Route index element={<List />} />
                  <Route path="home" element={<DoctorHomePage />} />
                  <Route path="dashboard" element={<DoctorHomePage />} />
                  <Route path="profile" element={<DoctorProfilePage />} />
                  <Route path="patient/all" element={<DoctorPatientsList />} />
                  <Route
                    path="patient/:patientId"
                    element={<DoctorPatientSingle />}
                  />
                  <Route path="new" element={<New />} />
                  <Route
                    path="appointment/create"
                    element={<AppointmentCreate />}
                  />
                  <Route
                    path="appointment/getall"
                    element={<AppointmentSlotsPage />}
                  />
                  <Route
                    path="appointment/booked/getall"
                    element={<AppointmentBooked />}
                  />
                  <Route
                    path="health-recommendations"
                    element={<DoctorRecommendationPage />}
                  />
                  <Route
                    path="health-recommendation/create"
                    element={<CreateRecommendationPage />}
                  />
                  <Route
                    path="health-recommendation/edit/:id"
                    element={<EditRecommendationPage />}
                  />
                  {/* Doctor Articles Routes */}
                  <Route path="articles" element={<DoctorArticlesPage />} />
                  <Route
                    path="articles/:articleId"
                    element={<ArticleDetailPage />}
                  />
                  <Route
                    path="articles/create"
                    element={<CreateArticlePage />}
                  />
                  <Route
                    path="articles/edit/:id"
                    element={<EditArticlePage />}
                  />
                </Route>
              </Route>
              <Route element={<Authenticate requiredRole={"Admin"} />}>
                <Route path="admin">
                  <Route index element={<List />} />
                  <Route path="patient/list" element={<List />} />
                  <Route path="patient/:patientId" element={<Single />} />
                  <Route path="doctor/list" element={<AdminDoctorList />} />
                  <Route path="doctor/add" element={<AdminAddDoctor />} />
                  <Route
                    path="doctor/:doctorId"
                    element={<AdminDoctorSingle />}
                  />
                  <Route path="home" element={<Home />} />
                  <Route path="dashboard" element={<Home />} />

                  {/* Inventory Management Routes */}
                  <Route
                    path="inventory/medicines"
                    element={<MedicineManagement />}
                  />
                  <Route
                    path="inventory/medical-equipment"
                    element={<MedicalEquipmentManagement />}
                  />
                  <Route
                    path="inventory/expiry-alerts"
                    element={<ExpiryAlerts />}
                  />

                  {/* Health Record Management Routes */}
                  <Route
                    path="health-records"
                    element={<HealthRecordManagement />}
                  />

                  {/* Analytics & Research Management Routes */}
                  <Route path="analytics" element={<AnalyticsManagement />} />

                  {/* Room Management Routes */}
                  <Route path="rooms" element={<RoomManagement />} />

                  <Route path=":adminId" element={<Single />} />
                  <Route path="new" element={<New />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>

        {/* Health Support Chat Widget - shows on all pages for logged in patients */}
        <HealthSupportChatWidget />

        <ToastContainer
          position="top-center"
          autoClose={2000}
          pauseOnHover={false}
          transition={Zoom}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
