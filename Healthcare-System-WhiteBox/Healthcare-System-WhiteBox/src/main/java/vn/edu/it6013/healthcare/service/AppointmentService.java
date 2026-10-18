package vn.edu.it6013.healthcare.service;

import vn.edu.it6013.healthcare.model.*;
import vn.edu.it6013.healthcare.repository.InMemoryDatabase;

import java.time.*;
import java.util.*;

public class AppointmentService {
    private final InMemoryDatabase db;
    private final Clock clock;

    public AppointmentService(InMemoryDatabase db) {
        this(db, Clock.systemDefaultZone());
    }

    public AppointmentService(InMemoryDatabase db, Clock clock) {
        this.db = Objects.requireNonNull(db);
        this.clock = Objects.requireNonNull(clock);
    }

    public List<AppointmentSlot> createSlots(
            String doctorId,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            int perPatientMinutes) {

        // WB-BR-01: doctor phải tồn tại
        if (doctorId == null || !db.doctors().containsKey(doctorId)) {
            throw new DomainException("Doctor not found");
        }

        // WB-BR-02: không cho tạo lịch trong quá khứ
        if (date == null || date.isBefore(LocalDate.now(clock))) {
            throw new DomainException("Past date not allowed");
        }

        // WB-BR-03: giờ bắt đầu phải nhỏ hơn giờ kết thúc
        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new DomainException("Start time must be before end time");
        }

        // WB-BR-04: thời lượng khám phải dương
        if (perPatientMinutes <= 0) {
            throw new DomainException("Per-patient duration must be positive");
        }

        long windowMinutes = Duration.between(startTime, endTime).toMinutes();

        // WB-BR-05: thời lượng mỗi bệnh nhân không được vượt khung giờ
        if (windowMinutes < perPatientMinutes) {
            throw new DomainException("Per-patient duration exceeds slot window");
        }

        List<AppointmentSlot> candidates = new ArrayList<>();
        LocalTime cursor = startTime;

        while (cursor.isBefore(endTime)) {
            LocalTime candidateEnd = cursor.plusMinutes(perPatientMinutes);
            if (candidateEnd.isAfter(endTime)) {
                break;
            }

            LocalTime candidateStart = cursor;

            // WB-BR-06: chặn overlap với slot đã tồn tại
            boolean overlaps = db.slots().values().stream().anyMatch(existing ->
                    existing.getDoctorId().equals(doctorId)
                            && existing.getDate().equals(date)
                            && candidateStart.isBefore(existing.getEndTime())
                            && candidateEnd.isAfter(existing.getStartTime()));

            if (overlaps) {
                throw new DomainException("Appointment slot overlaps existing slot");
            }

            candidates.add(new AppointmentSlot(
                    db.nextSlotId(), doctorId, date, candidateStart, candidateEnd, true));
            cursor = candidateEnd;
        }

        candidates.forEach(slot -> db.slots().put(slot.getId(), slot));
        return List.copyOf(candidates);
    }

    public Appointment book(String patientId, long slotId, AppointmentType type) {
        Patient patient = db.patients().get(patientId);

        // WB-BR-07: patient phải tồn tại và active
        if (patient == null || !patient.active()) {
            throw new DomainException("Patient not found or inactive");
        }

        AppointmentSlot slot = db.slots().get(slotId);

        // WB-BR-08: slot phải tồn tại
        if (slot == null) {
            throw new DomainException("Appointment slot not found");
        }

        // WB-BR-09: slot phải còn available
        if (!slot.isAvailable()) {
            throw new DomainException("Appointment slot not available");
        }

        // WB-BR-10: loại lịch hẹn bắt buộc
        if (type == null) {
            throw new DomainException("Appointment type is required");
        }

        // WB-BR-11: chặn cùng patient + doctor + ngày
        boolean duplicateSameDoctorDay = db.appointments().values().stream()
                .filter(a -> a.getStatus() == AppointmentStatus.BOOKED)
                .filter(a -> a.getPatientId().equals(patientId))
                .filter(a -> a.getDoctorId().equals(slot.getDoctorId()))
                .map(a -> db.slots().get(a.getSlotId()))
                .filter(Objects::nonNull)
                .anyMatch(oldSlot -> oldSlot.getDate().equals(slot.getDate()));

        if (duplicateSameDoctorDay) {
            throw new DomainException("Patient already booked this doctor on the same day");
        }

        slot.setAvailable(false);
        Appointment appointment = new Appointment(
                db.nextAppointmentId(),
                patientId,
                slotId,
                slot.getDoctorId(),
                type,
                AppointmentStatus.BOOKED);

        db.appointments().put(appointment.getId(), appointment);
        return appointment;
    }

    public Appointment cancel(long appointmentId) {
        Appointment appointment = db.appointments().get(appointmentId);

        // WB-BR-12: appointment phải tồn tại
        if (appointment == null) {
            throw new DomainException("Appointment not found");
        }

        // WB-BR-13: không cancel lặp lại
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new DomainException("Appointment already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        AppointmentSlot slot = db.slots().get(appointment.getSlotId());
        if (slot != null) {
            slot.setAvailable(true);
        }
        return appointment;
    }

    public List<AppointmentSlot> availableSlots() {
        return db.slots().values().stream()
                .filter(AppointmentSlot::isAvailable)
                .sorted(Comparator.comparing(AppointmentSlot::getDate)
                        .thenComparing(AppointmentSlot::getStartTime))
                .toList();
    }

    public List<Appointment> appointmentsOf(String patientId) {
        return db.appointments().values().stream()
                .filter(a -> a.getPatientId().equals(patientId))
                .toList();
    }

    public Collection<Doctor> doctors() {
        return List.copyOf(db.doctors().values());
    }

    public Patient patient(String id) {
        return db.patients().get(id);
    }
}
