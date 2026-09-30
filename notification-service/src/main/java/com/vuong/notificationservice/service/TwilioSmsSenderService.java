package com.vuong.notificationservice.service;

import com.vuong.notificationservice.exception.CustomException;

public interface TwilioSmsSenderService {
    void sendSms(String phoneNumberTo, String message) throws CustomException;
}
