package com.vuong.doctorservice.exception;

import com.vuong.doctorservice.dto.ResponseMessageDto;
import org.springframework.http.HttpStatus;

public class CustomException extends Exception {
    private final HttpStatus status;

    public CustomException(ResponseMessageDto responseMessageDto, HttpStatus status) {
        super(responseMessageDto.getMessage());
        this.status = status;
    }

    public CustomException(ResponseMessageDto responseMessageDto) {
        super(responseMessageDto.getMessage());
        this.status = responseMessageDto.getStatus();
    }

    public HttpStatus getStatus() {
        return status;
    }
}
