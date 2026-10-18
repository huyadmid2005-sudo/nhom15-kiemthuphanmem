package vn.edu.it6013.healthcare;

import vn.edu.it6013.healthcare.model.*;
import vn.edu.it6013.healthcare.repository.InMemoryDatabase;
import vn.edu.it6013.healthcare.service.*;

import java.time.*;
import java.util.*;

public class WhiteBoxTestRunner {
    private static int passed = 0;
    private static int failed = 0;

    private record Fixture(InMemoryDatabase db, AppointmentService service, LocalDate today) {}

    public static void main(String[] args) {
        run("WB-01 createSlots_valid_createsTwoSlots", WhiteBoxTestRunner::createSlotsValid);
        run("WB-02 createSlots_doctorMissing_throws", WhiteBoxTestRunner::doctorMissing);
        run("WB-03 createSlots_pastDate_throws", WhiteBoxTestRunner::pastDate);
        run("WB-04 createSlots_invalidTime_throws", WhiteBoxTestRunner::invalidTime);
        run("WB-05 createSlots_zeroDuration_throws", WhiteBoxTestRunner::zeroDuration);
        run("WB-06 createSlots_durationExceedsWindow_throws", WhiteBoxTestRunner::durationExceeds);
        run("WB-07 createSlots_overlap_throws", WhiteBoxTestRunner::overlap);
        run("WB-08 book_valid_success", WhiteBoxTestRunner::bookValid);
        run("WB-09 book_inactivePatient_throws", WhiteBoxTestRunner::inactivePatient);
        run("WB-10 book_slotNotFound_throws", WhiteBoxTestRunner::slotNotFound);
        run("WB-11 book_slotUnavailable_throws", WhiteBoxTestRunner::slotUnavailable);
        run("WB-12 book_typeMissing_throws", WhiteBoxTestRunner::typeMissing);
        run("WB-13 book_sameDoctorSameDay_throws", WhiteBoxTestRunner::duplicateDoctorDay);
        run("WB-14 cancel_valid_reopensSlot", WhiteBoxTestRunner::cancelValid);
        run("WB-15 cancel_missingOrRepeated_throws", WhiteBoxTestRunner::cancelInvalidCases);

        System.out.println();
        System.out.println("========================================");
        System.out.println("WHITE-BOX TEST SUMMARY");
        System.out.println("Tests run: " + (passed + failed));
        System.out.println("PASS:      " + passed);
        System.out.println("FAIL:      " + failed);
        System.out.println("Result:    " + (failed == 0 ? "PASS" : "FAIL"));
        System.out.println("========================================");

        if (failed > 0) System.exit(1);
    }

    private static Fixture fixture() {
        InMemoryDatabase db = new InMemoryDatabase();
        db.seedBasicData();
        LocalDate fixedToday = LocalDate.of(2026, 10, 16);
        Clock clock = Clock.fixed(
                fixedToday.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                ZoneId.systemDefault());
        return new Fixture(db, new AppointmentService(db, clock), fixedToday);
    }

    private static long oneSlot(Fixture f, String doctorId, LocalDate date, LocalTime start) {
        return f.service.createSlots(doctorId, date, start, start.plusMinutes(30), 30).get(0).getId();
    }

    private static void createSlotsValid() {
        Fixture f = fixture();
        var slots = f.service.createSlots("D001", f.today.plusDays(1),
                LocalTime.of(9,0), LocalTime.of(10,0), 30);
        eq(2, slots.size());
        truth(slots.stream().allMatch(AppointmentSlot::isAvailable), "all slots available");
    }

    private static void doctorMissing() {
        Fixture f = fixture();
        throwsMsg("Doctor not found", () -> f.service.createSlots(
                "NOPE", f.today.plusDays(1), LocalTime.of(9,0), LocalTime.of(10,0), 30));
    }

    private static void pastDate() {
        Fixture f = fixture();
        throwsMsg("Past date not allowed", () -> f.service.createSlots(
                "D001", f.today.minusDays(1), LocalTime.of(9,0), LocalTime.of(10,0), 30));
    }

    private static void invalidTime() {
        Fixture f = fixture();
        throwsMsg("Start time must be before end time", () -> f.service.createSlots(
                "D001", f.today.plusDays(1), LocalTime.of(10,0), LocalTime.of(9,0), 30));
    }

    private static void zeroDuration() {
        Fixture f = fixture();
        throwsMsg("Per-patient duration must be positive", () -> f.service.createSlots(
                "D001", f.today.plusDays(1), LocalTime.of(9,0), LocalTime.of(10,0), 0));
    }

    private static void durationExceeds() {
        Fixture f = fixture();
        throwsMsg("Per-patient duration exceeds slot window", () -> f.service.createSlots(
                "D001", f.today.plusDays(1), LocalTime.of(9,0), LocalTime.of(9,30), 60));
    }

    private static void overlap() {
        Fixture f = fixture();
        f.service.createSlots("D001", f.today.plusDays(1),
                LocalTime.of(9,0), LocalTime.of(10,0), 30);
        throwsMsg("Appointment slot overlaps existing slot", () -> f.service.createSlots(
                "D001", f.today.plusDays(1), LocalTime.of(9,30), LocalTime.of(10,30), 30));
    }

    private static void bookValid() {
        Fixture f = fixture();
        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        Appointment a = f.service.book("P001", slotId, AppointmentType.IN_PERSON);
        eq(AppointmentStatus.BOOKED, a.getStatus());
        truth(!f.db.slots().get(slotId).isAvailable(), "slot becomes unavailable");
    }

    private static void inactivePatient() {
        Fixture f = fixture();
        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        throwsMsg("Patient not found or inactive", () ->
                f.service.book("P002", slotId, AppointmentType.IN_PERSON));
    }

    private static void slotNotFound() {
        Fixture f = fixture();
        throwsMsg("Appointment slot not found", () ->
                f.service.book("P001", 999999, AppointmentType.IN_PERSON));
    }

    private static void slotUnavailable() {
        Fixture f = fixture();
        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        f.db.slots().get(slotId).setAvailable(false);
        throwsMsg("Appointment slot not available", () ->
                f.service.book("P001", slotId, AppointmentType.IN_PERSON));
    }

    private static void typeMissing() {
        Fixture f = fixture();
        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        throwsMsg("Appointment type is required", () ->
                f.service.book("P001", slotId, null));
    }

    private static void duplicateDoctorDay() {
        Fixture f = fixture();
        LocalDate d = f.today.plusDays(1);
        var slots = f.service.createSlots("D001", d, LocalTime.of(9,0), LocalTime.of(10,0), 30);
        f.service.book("P001", slots.get(0).getId(), AppointmentType.IN_PERSON);
        throwsMsg("Patient already booked this doctor on the same day", () ->
                f.service.book("P001", slots.get(1).getId(), AppointmentType.TELEMEDICINE));
    }

    private static void cancelValid() {
        Fixture f = fixture();
        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        Appointment booked = f.service.book("P001", slotId, AppointmentType.IN_PERSON);
        Appointment cancelled = f.service.cancel(booked.getId());
        eq(AppointmentStatus.CANCELLED, cancelled.getStatus());
        truth(f.db.slots().get(slotId).isAvailable(), "slot reopened");
    }

    private static void cancelInvalidCases() {
        Fixture f = fixture();
        throwsMsg("Appointment not found", () -> f.service.cancel(88888));

        long slotId = oneSlot(f, "D001", f.today.plusDays(1), LocalTime.of(9,0));
        Appointment booked = f.service.book("P001", slotId, AppointmentType.IN_PERSON);
        f.service.cancel(booked.getId());
        throwsMsg("Appointment already cancelled", () -> f.service.cancel(booked.getId()));
    }

    private static void run(String name, Runnable test) {
        try {
            test.run();
            passed++;
            System.out.println("[PASS] " + name);
        } catch (Throwable t) {
            failed++;
            System.out.println("[FAIL] " + name + " -> " + t.getMessage());
        }
    }

    private static void eq(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new AssertionError("expected=" + expected + ", actual=" + actual);
        }
    }

    private static void truth(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    private static void throwsMsg(String expectedMessage, Runnable action) {
        try {
            action.run();
            throw new AssertionError("Expected DomainException: " + expectedMessage);
        } catch (DomainException ex) {
            eq(expectedMessage, ex.getMessage());
        }
    }
}
