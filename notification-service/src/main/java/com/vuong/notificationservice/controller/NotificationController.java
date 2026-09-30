package com.vuong.notificationservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.rest.api.v2010.account.message.Media;
import com.vuong.notificationservice.dto.DataMailRequest;
import com.vuong.notificationservice.dto.NotificationDto;
import com.vuong.notificationservice.dto.NotificationPreferenceDto;
import com.vuong.notificationservice.dto.ResponseMessageDto;
import com.vuong.notificationservice.exception.CustomException;
import com.vuong.notificationservice.service.EmailSenderService;
import com.vuong.notificationservice.service.NotificationPreferenceService;
import com.vuong.notificationservice.service.NotificationService;
import com.vuong.notificationservice.service.TwilioSmsSenderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@Slf4j
public class NotificationController {
    @Autowired
    private TwilioSmsSenderService twilioSmsSenderService;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationPreferenceService notificationPreferenceService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/sms")
    public ResponseEntity<ResponseMessageDto> sendSms(@RequestParam("phoneNumberTo") String phoneNumberTo,
                                                      @RequestParam("message") String message) throws CustomException {
        log.info("inside sendSms method of NotificationController");
        twilioSmsSenderService.sendSms(phoneNumberTo, message);
        return new ResponseEntity<>(new ResponseMessageDto("SMS notification sent successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PostMapping("/email")
    public ResponseEntity<ResponseMessageDto> sendEmail(@RequestParam("emailTo") String emailTo,
                                                        @RequestParam("subject") String subject,
                                                        @RequestParam("messageBody") String messageBody) throws CustomException {
        log.info("inside sendEmail method of NotificationController");
        emailSenderService.sendEmail(emailTo, subject, messageBody);
        return new ResponseEntity<>(new ResponseMessageDto("Email notification sent successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PostMapping(
            value = "/email/with/attachment",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> sendEmailWithAttachment(@RequestPart("data") String dataMailRequest, @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
        log.info("inside sendEmailWithAttachment method of NotificationController");
        emailSenderService.sendEmailWithAttachment(objectMapper.readValue(dataMailRequest, DataMailRequest.class), files);
        return new ResponseEntity<>(new ResponseMessageDto("Mail sent successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PostMapping("/email/with/template")
    public ResponseEntity<?> sendEmailWithTemplate(@RequestBody String dataMailRequest) throws Exception {
        log.info("inside sendEmailWithTemplate method of NotificationController");

        emailSenderService.sendMailWithTemplate(objectMapper.readValue(dataMailRequest, DataMailRequest.class));
        return new ResponseEntity<>(new ResponseMessageDto("Mail sent successfully", HttpStatus.OK), HttpStatus.OK);
    }

    // controllers for notification preferences

    @PostMapping("/preferences/create")
    public ResponseEntity<ResponseMessageDto> createNotificationPreference(@RequestBody NotificationPreferenceDto notificationPreferenceDto) throws CustomException {
        log.info("inside createNotificationPreference method of NotificationController");
        notificationPreferenceService.createNotificationPreference(notificationPreferenceDto);
        return new ResponseEntity<>(new ResponseMessageDto("Notification preference created successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @GetMapping("/preferences/{userId}/{preferenceType}")
    public ResponseEntity<NotificationPreferenceDto> getNotificationPreferenceByPreferenceType(@PathVariable("userId") Long userId,
                                                                                                 @PathVariable("preferenceType") String preferenceType) throws CustomException {
        log.info("inside getNotificationPreferenceByPreferenceType method of NotificationController");
        return new ResponseEntity<>(notificationPreferenceService.getNotificationPreferenceByPreferenceType(userId, preferenceType), HttpStatus.OK);
    }

    @GetMapping("/preferences/{userId}")
    public ResponseEntity<List<NotificationPreferenceDto>> getAllNotificationPreferencesByUserId(@PathVariable("userId") Long userId) throws CustomException {
        log.info("inside getAllNotificationPreferencesByUserId method of NotificationController");
        List<NotificationPreferenceDto> notificationPreferences = notificationPreferenceService.getAllNotificationPreferencesByUserId(userId);
        return new ResponseEntity<>(notificationPreferences, HttpStatus.OK);
    }

    @PutMapping("/preferences/update")
    public ResponseEntity<ResponseMessageDto> updateNotificationPreference(@RequestBody NotificationPreferenceDto notificationPreferenceDto) throws CustomException {
        log.info("inside updateNotificationPreference method of NotificationController");
        notificationPreferenceService.updateNotificationPreference(notificationPreferenceDto);
        return new ResponseEntity<>(new ResponseMessageDto("Notification preference updated successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @DeleteMapping("/preferences/delete/{notificationPreferenceId}")
    public ResponseEntity<ResponseMessageDto> deleteNotificationPreference(@PathVariable("notificationPreferenceId") Long notificationPreferenceId) throws CustomException {
        log.info("inside deleteNotificationPreference method of NotificationController");
        notificationPreferenceService.deleteNotificationPreference(notificationPreferenceId);
        return new ResponseEntity<>(new ResponseMessageDto("Notification preference deleted successfully", HttpStatus.OK), HttpStatus.OK);
    }

    // controllers for notifications

    @PostMapping("/create")
    public ResponseEntity<ResponseMessageDto> createNotification(@RequestBody NotificationDto notificationDto) throws CustomException {
        log.info("inside createNotification method of NotificationController");
        notificationService.createNotification(notificationDto);
        return new ResponseEntity<>(new ResponseMessageDto("Notification created successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDto>> getAllNotificationsByUserId(@PathVariable("userId") Long userId) throws CustomException {
        log.info("inside getAllNotificationsByUserId method of NotificationController");
        List<NotificationDto> notifications = notificationService.getAllNotificationsByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<NotificationDto>> getUnreadNotificationsByUserId(@PathVariable("userId") Long userId) throws CustomException {
        log.info("inside getUnreadNotificationsByUserId method of NotificationController");
        List<NotificationDto> notifications = notificationService.getUnreadNotificationsByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @PostMapping("/mark-read/{notificationId}")
    public ResponseEntity<ResponseMessageDto> markNotificationAsRead(@PathVariable("notificationId") Long notificationId) throws CustomException {
        log.info("inside markNotificationAsRead method of NotificationController");
        notificationService.markNotificationAsRead(notificationId);
        return new ResponseEntity<>(new ResponseMessageDto("Notification marked as read successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PostMapping("/mark-all-read/{userId}")
    public ResponseEntity<ResponseMessageDto> markAllNotificationsAsRead(@PathVariable("userId") Long userId) throws CustomException {
        log.info("inside markAllNotificationsAsRead method of NotificationController");
        notificationService.markAllNotificationsAsRead(userId);
        return new ResponseEntity<>(new ResponseMessageDto("All notifications marked as read successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{notificationId}")
    public ResponseEntity<ResponseMessageDto> deleteNotification(@PathVariable("notificationId") Long notificationId) throws CustomException {
        log.info("inside deleteNotification method of NotificationController");
        notificationService.deleteNotification(notificationId);
        return new ResponseEntity<>(new ResponseMessageDto("Notification deleted successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseMessageDto> updateNotification(@RequestBody NotificationDto notificationDto) throws CustomException {
        log.info("inside updateNotification method of NotificationController");
        notificationService.updateNotification(notificationDto);
        return new ResponseEntity<>(new ResponseMessageDto("Notification updated successfully", HttpStatus.OK), HttpStatus.OK);
    }
}
