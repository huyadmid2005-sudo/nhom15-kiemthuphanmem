package com.vuong.patientservice.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vuong.patientservice.dto.ResponseMessageDto;
import com.vuong.patientservice.exception.CustomException;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseMessageDto> handleCustomException(CustomException e) {
        ResponseMessageDto errorResponse = new ResponseMessageDto(e.getMessage(), e.getStatus());
        return new ResponseEntity<>(errorResponse, e.getStatus());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ResponseMessageDto> handleResponseStatusException(ResponseStatusException e) {
        ResponseMessageDto responseMessage = new ResponseMessageDto(e.getReason(), (HttpStatus) e.getStatusCode());
        return new ResponseEntity<>(responseMessage, e.getStatusCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseMessageDto> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getDefaultMessage())
                .filter(message -> message != null && !message.isBlank())
                .findFirst()
                .orElse("Validation failed");
        ResponseMessageDto responseMessage = new ResponseMessageDto(errorMessage, HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(responseMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ResponseMessageDto> handleFeignException(FeignException e) {
        HttpStatus status = HttpStatus.resolve(e.status());
        HttpStatus responseStatus = status != null ? status : HttpStatus.BAD_GATEWAY;
        ResponseMessageDto responseMessage = new ResponseMessageDto(extractFeignMessage(e), responseStatus);
        return new ResponseEntity<>(responseMessage, responseStatus);
    }

    private String extractFeignMessage(FeignException e) {
        String responseBody = e.contentUTF8();
        if (responseBody != null && !responseBody.isBlank()) {
            try {
                JsonNode json = objectMapper.readTree(responseBody);
                JsonNode message = json.get("message");
                if (message != null && !message.asText().isBlank()) {
                    return message.asText();
                }
            } catch (Exception ignored) {
                return responseBody;
            }
        }
        return "Error occurred while calling downstream service";
    }

//    @ExceptionHandler(NullPointerException.class)
//    public ResponseEntity<ResponseMessageDto> handleNullPointerException(NullPointerException e) {
//        ResponseMessageDto responseMessage = new ResponseMessageDto("Null Pointer Exception", HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(responseMessage, HttpStatus.BAD_REQUEST);
//    }
}
