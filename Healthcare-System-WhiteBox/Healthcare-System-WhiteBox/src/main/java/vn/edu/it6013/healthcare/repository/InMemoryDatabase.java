package vn.edu.it6013.healthcare.repository;

import vn.edu.it6013.healthcare.model.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryDatabase {
    private final Map<String, Doctor> doctors = new LinkedHashMap<>();
    private final Map<String, Patient> patients = new LinkedHashMap<>();
    private final Map<Long, AppointmentSlot> slots = new LinkedHashMap<>();
    private final Map<Long, Appointment> appointments = new LinkedHashMap<>();

    private final AtomicLong slotSequence = new AtomicLong(100);
    private final AtomicLong appointmentSequence = new AtomicLong(1000);

    public Map<String, Doctor> doctors() { return doctors; }
    public Map<String, Patient> patients() { return patients; }
    public Map<Long, AppointmentSlot> slots() { return slots; }
    public Map<Long, Appointment> appointments() { return appointments; }

    public long nextSlotId() { return slotSequence.incrementAndGet(); }
    public long nextAppointmentId() { return appointmentSequence.incrementAndGet(); }

    public void seedBasicData() {
        doctors.put("D001", new Doctor("D001", "Dr. Minh Le", "Cardiology"));
        doctors.put("D002", new Doctor("D002", "Dr. Lan Pham", "Neurology"));

        patients.put("P001", new Patient("P001", "An Nguyen", true));
        patients.put("P002", new Patient("P002", "Mai Tran", false));
    }
}
