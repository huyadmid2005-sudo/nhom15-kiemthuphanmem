package com.vuong.analyticresearchservice.networkmanager;

import com.vuong.analyticresearchservice.dto.DataMailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "notification-service", configuration = FeignClientConfiguration.class)
public interface NotificationServiceFeignClient {
    @PostMapping(
            value = "notifications/email/with/attachment",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    ResponseEntity<?> sendEmailWithAttachment(@RequestPart("data") String dataMailRequest, @RequestPart(value = "files", required = false) MultipartFile[] files);
}
