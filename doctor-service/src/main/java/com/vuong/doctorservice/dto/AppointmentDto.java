package com.vuong.doctorservice.dto;


import com.vuong.doctorservice.enums.AppointmentStatus;
import com.vuong.doctorservice.enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentDto {
    private Long appointmentId;
    private String doctorId;
    private String patientId;
    private Long doctorAvailabilityId;
    private AppointmentType appointmentType;
    private AppointmentStatus appointmentStatus;
    private Boolean isActive;
}