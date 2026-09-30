package com.vuong.cdssservice.networkmanager;

import com.vuong.cdssservice.dto.NotificationDto;
import com.vuong.cdssservice.dto.ResponseMessageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", configuration = FeignClientConfiguration.class)
public interface NotificationServiceFeignClient {
    @PostMapping("/notifications/create")
    ResponseEntity<ResponseMessageDto> createNotification(@RequestBody NotificationDto notificationDto);
}
