package vn.edu.it6013.healthcare.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentSlot {
    private final long id;
    private final String doctorId;
    private final LocalDate date;
    private final LocalTime startTime;
    private final LocalTime endTime;
    private boolean available;

    public AppointmentSlot(long id, String doctorId, LocalDate date,
                           LocalTime startTime, LocalTime endTime, boolean available) {
        this.id = id;
        this.doctorId = doctorId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
    }

    public long getId() { return id; }
    public String getDoctorId() { return doctorId; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
