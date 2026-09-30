import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // 'en' for English, 'vi' for Vietnamese

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"));
  };

  const translations = {
    en: {
      // Navigation
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      login: "Login",
      register: "Register",

      // Hero Section
      heroTitle: "Advanced Healthcare Management System",
      heroSubtitle:
        "Comprehensive digital healthcare solutions for patients, doctors, and healthcare providers. Experience seamless medical care management with our cutting-edge technology.",
      bookAppointment: "Book Appointment",
      learnMore: "Learn More",

      // Stats
      patientsServed: "Patients Served",
      doctorsAvailable: "Doctors Available",
      yearsExperience: "Years Experience",
      successRate: "Success Rate",

      // Services
      servicesTitle: "Our Healthcare Services",
      servicesSubtitle:
        "Comprehensive medical care solutions tailored to your needs",
      onlineConsultation: "Online Consultation",
      onlineConsultationDesc:
        "Connect with healthcare professionals from the comfort of your home",
      telemedicine: "Telemedicine",
      telemedicineDesc:
        "Virtual medical consultations and remote patient monitoring",
      appointmentScheduling: "Appointment Scheduling",
      appointmentSchedulingDesc:
        "Easy and convenient appointment booking system",
      emergencyServices: "Emergency Services",
      emergencyServicesDesc:
        "24/7 emergency medical assistance when you need it most",
      healthRecords: "Digital Health Records",
      healthRecordsDesc:
        "Secure and accessible digital health record management",

      // Why Choose Us
      whyChooseTitle: "Why Choose Our Healthcare System?",
      advancedTechnology: "Advanced Technology",
      advancedTechnologyDesc:
        "State-of-the-art medical equipment and digital health solutions",
      expertTeam: "Expert Medical Team",
      expertTeamDesc: "Highly qualified doctors and healthcare professionals",
      availability24: "24/7 Availability",
      availability24Desc: "Round-the-clock medical care and emergency services",
      comprehensiveCare: "Comprehensive Care",
      comprehensiveCareDesc: "Complete healthcare solutions under one roof",

      // About Section
      aboutTitle: "About HMS",
      aboutSubtitle:
        "Leading healthcare management with innovation and compassion",
      ourMission: "Our Mission",
      missionText:
        "To provide comprehensive, accessible, and high-quality healthcare services through innovative technology and compassionate care. We strive to improve health outcomes and enhance the patient experience through our integrated healthcare management system.",
      ourVision: "Our Vision",
      visionText:
        "To be the leading healthcare management system that transforms healthcare delivery through digital innovation, making quality healthcare accessible to everyone, everywhere.",
      ourValues: "Our Values",
      patientCenteredCare: "Patient-centered care",
      trustTransparency: "Trust and transparency",
      clinicalExcellence: "Clinical excellence",
      collaborativeApproach: "Collaborative approach",
      healthcareProviders: "Healthcare Providers",
      medicalSpecialties: "Medical Specialties",
      emergencyCare: "Emergency Care",

      // CTA Section
      ctaTitle: "Ready to Experience Better Healthcare?",
      ctaSubtitle:
        "Join thousands of patients who trust our healthcare management system",
      getStarted: "Get Started Today",
      applyResearch: "Apply for Research Data",

      // Contact
      contactTitle: "Get In Touch",
      contactSubtitle: "We're here to help you with all your healthcare needs",
      ourLocation: "Our Location",
      callUs: "Call Us",
      emailUs: "Email Us",
      yourName: "Your Name",
      yourEmail: "Your Email",
      yourMessage: "Your Message",
      sendMessage: "Send Message",

      // Footer
      quickLinks: "Quick Links",
      contactInfo: "Contact Info",
      followUs: "Follow Us",
      allRightsReserved: "All rights reserved. Healthcare Management System",

      // Forms
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      phoneNumber: "Phone Number",
      address: "Address",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      bloodGroup: "Blood Group",
      signIn: "Sign In",
      signUp: "Sign Up",
      loading: "Loading...",
    },
    vi: {
      // Navigation
      home: "Trang chủ",
      services: "Dịch vụ",
      about: "Về chúng tôi",
      contact: "Liên hệ",
      login: "Đăng nhập",
      register: "Đăng ký",

      // Hero Section
      heroTitle: "Hệ thống Quản lý Y tế Tiên tiến",
      heroSubtitle:
        "Giải pháp chăm sóc sức khỏe số toàn diện cho bệnh nhân, bác sĩ và nhà cung cấp dịch vụ y tế. Trải nghiệm quản lý chăm sóc y tế liền mạch với công nghệ tiên tiến của chúng tôi.",
      bookAppointment: "Đặt lịch khám",
      learnMore: "Tìm hiểu thêm",

      // Stats
      patientsServed: "Bệnh nhân đã phục vụ",
      doctorsAvailable: "Bác sĩ sẵn sàng",
      yearsExperience: "Năm kinh nghiệm",
      successRate: "Tỷ lệ thành công",

      // Services
      servicesTitle: "Dịch vụ Y tế của Chúng tôi",
      servicesSubtitle:
        "Giải pháp chăm sóc y tế toàn diện được thiết kế phù hợp với nhu cầu của bạn",
      onlineConsultation: "Tư vấn Trực tuyến",
      onlineConsultationDesc:
        "Kết nối với các chuyên gia y tế từ sự thoải mái của ngôi nhà bạn",
      telemedicine: "Y học Từ xa",
      telemedicineDesc: "Tư vấn y tế ảo và theo dõi bệnh nhân từ xa",
      appointmentScheduling: "Lên lịch Hẹn",
      appointmentSchedulingDesc: "Hệ thống đặt lịch hẹn dễ dàng và thuận tiện",
      emergencyServices: "Dịch vụ Cấp cứu",
      emergencyServicesDesc: "Hỗ trợ y tế khẩn cấp 24/7 khi bạn cần nhất",
      healthRecords: "Hồ sơ Y tế Số",
      healthRecordsDesc: "Quản lý hồ sơ y tế số an toàn và dễ truy cập",

      // Why Choose Us
      whyChooseTitle: "Tại sao chọn Hệ thống Y tế của chúng tôi?",
      advancedTechnology: "Công nghệ Tiên tiến",
      advancedTechnologyDesc: "Thiết bị y tế hiện đại và giải pháp sức khỏe số",
      expertTeam: "Đội ngũ Y tế Chuyên môn",
      expertTeamDesc: "Các bác sĩ và chuyên gia y tế có trình độ cao",
      availability24: "Sẵn sàng 24/7",
      availability24Desc: "Chăm sóc y tế và dịch vụ cấp cứu suốt ngày đêm",
      comprehensiveCare: "Chăm sóc Toàn diện",
      comprehensiveCareDesc:
        "Giải pháp chăm sóc sức khỏe hoàn chỉnh dưới một mái nhà",

      // About Section
      aboutTitle: "Về HMS",
      aboutSubtitle: "Dẫn đầu quản lý y tế với sự đổi mới và lòng trcompassion",
      ourMission: "Sứ mệnh của chúng tôi",
      missionText:
        "Cung cấp dịch vụ chăm sóc sức khỏe toàn diện, dễ tiếp cận và chất lượng cao thông qua công nghệ đổi mới và sự chăm sóc đầy lòng trắc ẩn. Chúng tôi nỗ lực cải thiện kết quả sức khỏe và nâng cao trải nghiệm bệnh nhân thông qua hệ thống quản lý y tế tích hợp của mình.",
      ourVision: "Tầm nhìn của chúng tôi",
      visionText:
        "Trở thành hệ thống quản lý y tế hàng đầu biến đổi việc cung cấp dịch vụ y tế thông qua đổi mới số, làm cho chăm sóc sức khỏe chất lượng có thể tiếp cận được với mọi người, ở mọi nơi.",
      ourValues: "Giá trị của chúng tôi",
      patientCenteredCare: "Chăm sóc lấy bệnh nhân làm trung tâm",
      trustTransparency: "Tin cậy và minh bạch",
      clinicalExcellence: "Xuất sắc lâm sàng",
      collaborativeApproach: "Phương pháp hợp tác",
      healthcareProviders: "Nhà cung cấp Y tế",
      medicalSpecialties: "Chuyên khoa Y tế",
      emergencyCare: "Chăm sóc Cấp cứu",

      // CTA Section
      ctaTitle: "Sẵn sàng Trải nghiệm Chăm sóc Y tế Tốt hơn?",
      ctaSubtitle:
        "Tham gia cùng hàng nghìn bệnh nhân tin tưởng hệ thống quản lý y tế của chúng tôi",
      getStarted: "Bắt đầu Ngay hôm nay",
      applyResearch: "Đăng ký Dữ liệu Nghiên cứu",

      // Contact
      contactTitle: "Liên hệ với chúng tôi",
      contactSubtitle:
        "Chúng tôi ở đây để giúp bạn với tất cả các nhu cầu chăm sóc sức khỏe",
      ourLocation: "Vị trí của chúng tôi",
      callUs: "Gọi cho chúng tôi",
      emailUs: "Email cho chúng tôi",
      yourName: "Tên của bạn",
      yourEmail: "Email của bạn",
      yourMessage: "Tin nhắn của bạn",
      sendMessage: "Gửi tin nhắn",

      // Footer
      quickLinks: "Liên kết Nhanh",
      contactInfo: "Thông tin Liên hệ",
      followUs: "Theo dõi chúng tôi",
      allRightsReserved: "Tất cả quyền được bảo lưu. Hệ thống Quản lý Y tế",

      // Forms
      firstName: "Tên",
      lastName: "Họ",
      email: "Email",
      password: "Mật khẩu",
      phoneNumber: "Số điện thoại",
      address: "Địa chỉ",
      dateOfBirth: "Ngày sinh",
      gender: "Giới tính",
      bloodGroup: "Nhóm máu",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      loading: "Đang tải...",
    },
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
