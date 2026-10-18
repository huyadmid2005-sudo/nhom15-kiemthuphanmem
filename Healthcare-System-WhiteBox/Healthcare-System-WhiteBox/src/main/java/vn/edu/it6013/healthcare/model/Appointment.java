package vn.edu.it6013.healthcare.model;

public class Appointment {
    private final long id;
    private final String patientId;
    private final long slotId;
    private final String doctorId;
    private final AppointmentType type;
    private AppointmentStatus status;

    public Appointment(long id, String patientId, long slotId, String doctorId,
                       AppointmentType type, AppointmentStatus status) {
        this.id = id;
        this.patientId = patientId;
        this.slotId = slotId;
        this.doctorId = doctorId;
        this.type = type;
        this.status = status;
    }

    public long getId() { return id; }
    public String getPatientId() { return patientId; }
    public long getSlotId() { return slotId; }
    public String getDoctorId() { return doctorId; }
    public AppointmentType getType() { return type; }
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
}
