package com.vuong.analyticresearchservice.dto;

import lombok.*;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DataMailRequest {
    private String to;
    private String subject;
    private String content;
    private String template;
    private Map<String, Object> properties;
}
