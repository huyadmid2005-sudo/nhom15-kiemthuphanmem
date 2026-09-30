package com.vuong.notificationservice.utils;


import com.vuong.notificationservice.dto.DataMailRequest;
import com.vuong.notificationservice.dto.ResponseMessageDto;
import com.vuong.notificationservice.exception.CustomException;
import com.vuong.notificationservice.service.NotificationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class SendMailUtil {

    private final TemplateEngine templateEngine;

    private final JavaMailSender mailSender;

    /**
     * Gửi mail với file html
     *
     * @param mail Thông tin của mail cần gửi
     */
    public void sendEmailWithHTML(DataMailRequest mail) throws Exception {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();


            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            mimeMessageHelper.setFrom("noreply@whodev.top");
            mimeMessageHelper.setTo(mail.getTo());
            mimeMessageHelper.setSubject(mail.getSubject());

            Context context = new Context();
            context.setVariables(mail.getProperties());
            String htmlMsg = templateEngine.process(resolveTemplateName(mail.getTemplate()), context);
            mimeMessageHelper.setText(htmlMsg, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            String errorMessage = getRootCauseMessage(e);
            log.error("error sending email to {}: {}", mail.getTo(), errorMessage, e);
            throw new CustomException(new ResponseMessageDto("Error sending email: " + errorMessage, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Gửi mail với tệp đính kèm
     *
     * @param mail  Thông tin của mail cần gửi
     * @param files File cần gửi
     */
    public void sendEmailWithAttachment(DataMailRequest mail, MultipartFile[] files) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setFrom("noreply@whodev.top");
        mimeMessageHelper.setTo(mail.getTo());
        mimeMessageHelper.setSubject(mail.getSubject());
        mimeMessageHelper.setText(mail.getContent());
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                mimeMessageHelper.addAttachment(Objects.requireNonNull(file.getOriginalFilename()), file);
            }
        }
        mailSender.send(mimeMessage);
    }

    public void sendEmailWithAttachmentAndHtml(DataMailRequest mail, MultipartFile[] files) throws MessagingException, CustomException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setFrom("noreply@whodev.top");
            helper.setTo(mail.getTo());
            helper.setSubject(mail.getSubject());
            Context context = new Context();
            context.setVariables(mail.getProperties());
            String htmlMsg = templateEngine.process(resolveTemplateName(mail.getTemplate()), context);
            helper.setText(htmlMsg, true);
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    helper.addAttachment(Objects.requireNonNull(file.getOriginalFilename()), file);
                }
            }
            mailSender.send(message);
        } catch (Exception e) {
            String errorMessage = getRootCauseMessage(e);
            log.error("error sending email to {}: {}", mail.getTo(), errorMessage, e);
            throw new CustomException(new ResponseMessageDto("Error sending email: " + errorMessage, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
    }

    private String resolveTemplateName(String template) {
        if (template == null) {
            return null;
        }

        return template.endsWith(".html") ? template.substring(0, template.length() - 5) : template;
    }

    private String getRootCauseMessage(Exception exception) {
        Throwable cause = exception;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }

        String message = cause.getMessage();
        return message != null && !message.isBlank() ? message : exception.getMessage();
    }
}
