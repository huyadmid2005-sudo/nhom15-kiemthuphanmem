package com.vuong.communityportalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDto {
    private String doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String specialization;
    private boolean isApproved;
}
