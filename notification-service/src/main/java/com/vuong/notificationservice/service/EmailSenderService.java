package com.vuong.notificationservice.service;

import com.vuong.notificationservice.dto.DataMailRequest;
import com.vuong.notificationservice.exception.CustomException;
import org.springframework.web.multipart.MultipartFile;

public interface EmailSenderService {
    void sendEmail(String emailTo, String subject, String message) throws CustomException;
    void sendEmailWithAttachment(DataMailRequest dataMailRequest, MultipartFile[] files) throws Exception;
    void sendMailWithTemplate(DataMailRequest dataMailRequest) throws Exception;
}
