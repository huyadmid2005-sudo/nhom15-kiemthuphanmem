package com.vuong.cdssservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiRequestDto {
    private String model;
    private List<OpenAiMessageDto> messages;

    public OpenAiRequestDto(String model, String prompt) {
        this.model = model;
        this.messages = List.of(new OpenAiMessageDto("user", prompt));
    }
}
