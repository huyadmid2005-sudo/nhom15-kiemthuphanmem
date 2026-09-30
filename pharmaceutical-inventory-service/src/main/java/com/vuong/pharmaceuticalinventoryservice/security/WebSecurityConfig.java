package com.vuong.pharmaceuticalinventoryservice.security;

import com.vuong.pharmaceuticalinventoryservice.constants.AppConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager)
            throws Exception {
        http
                // CORS is handled by API Gateway — do NOT add here to avoid duplicate headers
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers(HttpMethod.POST, "/pharmaceutical-inventory/medical-equipment/create").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .requestMatchers(HttpMethod.PUT, "/pharmaceutical-inventory/medical-equipment/update/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR)
                            .requestMatchers(HttpMethod.DELETE, "/pharmaceutical-inventory/medical-equipment/delete/**").hasAuthority(AppConstants.ROLE_ADMIN)
                            .requestMatchers(HttpMethod.GET, "/pharmaceutical-inventory/medical-equipment/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .requestMatchers(HttpMethod.POST, "/pharmaceutical-inventory/medicine/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .requestMatchers(HttpMethod.PUT, "/pharmaceutical-inventory/medicine/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .requestMatchers(HttpMethod.DELETE, "/pharmaceutical-inventory/medicine/**").hasAnyAuthority(AppConstants.ROLE_ADMIN)
                            .requestMatchers(HttpMethod.GET, "/pharmaceutical-inventory/medicine/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .requestMatchers(HttpMethod.POST, "/pharmaceutical-inventory/**").hasAnyAuthority(AppConstants.ROLE_ADMIN, AppConstants.ROLE_DOCTOR, AppConstants.ROLE_PATIENT)
                            .anyRequest().permitAll();
                })
                .addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
        ;
        return http.build();
    }
}