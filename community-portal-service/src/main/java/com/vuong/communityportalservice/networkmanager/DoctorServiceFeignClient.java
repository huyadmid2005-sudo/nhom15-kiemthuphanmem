package com.vuong.communityportalservice.networkmanager;

import com.vuong.communityportalservice.dto.DoctorDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "doctor-service", configuration = FeignClientConfiguration.class)
public interface DoctorServiceFeignClient {

    @GetMapping("/doctors/profile")
    ResponseEntity<DoctorDto> getCurrentDoctor();

    @GetMapping("/doctors/id/{doctorId}")
    ResponseEntity<DoctorDto> getDoctorById(@PathVariable String doctorId);
}
