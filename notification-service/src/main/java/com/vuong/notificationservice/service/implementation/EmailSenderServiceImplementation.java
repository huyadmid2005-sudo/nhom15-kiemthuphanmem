package com.vuong.notificationservice.service.implementation;

import com.vuong.notificationservice.dto.DataMailRequest;
import com.vuong.notificationservice.dto.ResponseMessageDto;
import com.vuong.notificationservice.exception.CustomException;
import com.vuong.notificationservice.service.EmailSenderService;
import com.vuong.notificationservice.service.NotificationService;
import com.vuong.notificationservice.utils.SendMailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class EmailSenderServiceImplementation implements EmailSenderService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SendMailUtil sendMailUtil;

    @Override
    public void sendEmail(String emailTo, String subject, String messageBody)
            throws CustomException {
        try {
            log.info("inside sendEmail method of EmailSenderServiceImplementation");
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailTo);
            message.setSubject(subject);
            message.setText(messageBody);
            log.info("sending email to {}", emailTo);
            javaMailSender.send(message);
            log.info("email sent successfully to {}", emailTo);
        } catch (Exception e) {
            log.error("error sending email to {}", emailTo);
            throw new CustomException(new ResponseMessageDto("Error sending email", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void sendEmailWithAttachment(DataMailRequest dataMailRequest, MultipartFile[] files) throws Exception {
        if (files == null || files.length == 0) {
            sendMailUtil.sendEmailWithHTML(dataMailRequest);
        } else {
            sendMailUtil.sendEmailWithAttachmentAndHtml(dataMailRequest, files);
        }
    }

    @Override
    public void sendMailWithTemplate(DataMailRequest dataMailRequest) throws Exception {
        System.out.println(dataMailRequest.getTo());
        System.out.println(dataMailRequest.getSubject());
        System.out.println(dataMailRequest.getTemplate());
        sendMailUtil.sendEmailWithHTML(dataMailRequest);
    }


}
