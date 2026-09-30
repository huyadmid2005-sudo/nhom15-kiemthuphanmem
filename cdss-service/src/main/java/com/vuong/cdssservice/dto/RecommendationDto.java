package com.vuong.cdssservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {
    private Long id;
    private String patientId;
    private String doctorId;
    private String recommendationMessage;
    private List<ItemDto> items;
    private LocalDate createdDate;
    private LocalDate rescheduleAppointment;
}
