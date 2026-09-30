package com.vuong.cdssservice.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class RecommendationCreateDto {
    private String patientId;
    private String doctorId;
    private String recommendationMessage;
    private List<ItemDto> items;
    private LocalDate rescheduleAppointment;
}
