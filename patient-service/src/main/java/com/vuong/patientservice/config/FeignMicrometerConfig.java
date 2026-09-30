package com.vuong.patientservice.config;

import feign.Feign;
import feign.micrometer.MicrometerCapability;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignMicrometerConfig {
    @Bean
    Feign.Builder feignBuilder(MeterRegistry meterRegistry) {
        return Feign.builder().addCapability(new MicrometerCapability(meterRegistry));
    }
}