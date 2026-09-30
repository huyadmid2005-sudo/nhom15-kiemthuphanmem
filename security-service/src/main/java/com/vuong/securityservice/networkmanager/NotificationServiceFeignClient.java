package com.vuong.securityservice.networkmanager;

import com.vuong.securityservice.dto.DataMailRequest;
import com.vuong.securityservice.dto.ResponseMessageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", configuration = FeignClientConfiguration.class)
public interface NotificationServiceFeignClient {
    @PostMapping("notifications/email/with/template")
    ResponseEntity<?> sendEmailWithTemplate(@RequestBody String dataMailRequest);
}