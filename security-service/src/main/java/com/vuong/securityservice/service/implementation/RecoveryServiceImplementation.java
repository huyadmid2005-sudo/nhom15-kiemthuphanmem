package com.vuong.securityservice.service.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vuong.securityservice.dto.DataMailRequest;
import com.vuong.securityservice.dto.ResponseMessageDto;
import com.vuong.securityservice.dto.VerifyCodeDto;
import com.vuong.securityservice.entity.UserEntity;
import com.vuong.securityservice.exception.CustomException;
import com.vuong.securityservice.networkmanager.NotificationServiceFeignClient;
import com.vuong.securityservice.repository.UserRepository;
import com.vuong.securityservice.service.RecoveryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@Slf4j
public class RecoveryServiceImplementation implements RecoveryService {
    private static final int MAX_SEND_COUNT_PER_HOUR = 5;
    private final Duration COUNT_TTL = Duration.ofHours(1);
    private final Duration BAN_TTL = Duration.ofMinutes(20);
    private final Duration CODE_TTL = Duration.ofMinutes(5);

    @Autowired
    private StringRedisTemplate template;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationServiceFeignClient notificationServiceFeignClient;

    @Value("${front-end.url}")
    private String frontEndUrl;

    @Autowired
    private ObjectMapper objectMapper;

    public String sendMail(String email) throws CustomException {
        try {
            //get IP
            log.info("getting ip");
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = requestAttributes.getRequest();
            String ip = request.getRemoteAddr();

            //Check if ban ip
            log.info("check if ip: {} banned", ip);
            String banKey = "mail:ban:" + ip;
            if (template.hasKey(banKey)) {
                throw new CustomException(
                        new ResponseMessageDto("Too many request, try again in 20 minutes", HttpStatus.TOO_MANY_REQUESTS),
                        HttpStatus.TOO_MANY_REQUESTS
                );
            }

            // Count mail + ip send
            String countKey = "mail:count:" + ip;
            Long count = template.opsForValue().increment(countKey);
            if (count == 1L) {
                template.expire(countKey, COUNT_TTL);
            }

            // Ban ip
            log.info("banned ip: {}", ip);
            if (count > MAX_SEND_COUNT_PER_HOUR) {
                template.opsForValue().set(banKey, "1", BAN_TTL);
                throw new CustomException(
                        new ResponseMessageDto("Too many request, try again in 20 minutes", HttpStatus.TOO_MANY_REQUESTS),
                        HttpStatus.TOO_MANY_REQUESTS
                );
            }

            //create random code
            String code = String.format(
                    "%06d",
                    new SecureRandom().nextInt(1_000_000)
            );

            UserEntity user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new CustomException(new ResponseMessageDto("No user found with email: " + email, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST));

            String resetLink = frontEndUrl + "/ChangePassword?email=" + email + "&code=" + code;

            Map<String, Object> props = new HashMap<>();
            props.put("resetLink", resetLink);
            props.put("email", email);
            props.put("username", user.getEmail());
            props.put("appName", "HMS");
            props.put("validTime", "15 phút");

            DataMailRequest data = DataMailRequest.builder()
                    .to(email)
                    .content("Your Verification Code:" + code)
                    .subject("Verification Code")
                    .properties(props)
                    .template("otp.html")
                    .build();

            log.info("sending email in notification service");
            System.out.println(data.getTo());
            System.out.println(data.getSubject());
            System.out.println(data.getTemplate());
            notificationServiceFeignClient.sendEmailWithTemplate(objectMapper.writeValueAsString(data));

            //delete old code
            log.info("deleting old codes");
            String codeKey = "mail:code:" + email;
            template.delete(codeKey);

            log.info("creating new code");
            //set new code
            template.opsForValue().set(codeKey, code, CODE_TTL);

            return "Send code to email successfully";
        } catch (CustomException e) {
            throw new CustomException(new ResponseMessageDto(e.getMessage(), e.getStatus()), e.getStatus());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String verifyCode(VerifyCodeDto verifyCode) throws CustomException {
        try {
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = requestAttributes.getRequest();
            String ip = request.getRemoteAddr();

            //check if ban
            log.info("check if ip: {} banned", ip);
            String banKey = "mail:ban:" + ip;
            if (Boolean.TRUE.equals(template.hasKey(banKey))) {
                throw new CustomException(
                        new ResponseMessageDto("Too many request, try again in 20 minutes", HttpStatus.TOO_MANY_REQUESTS),
                        HttpStatus.TOO_MANY_REQUESTS
                );
            }

            //check code expired
            log.info("checking expired code?");
            String codeKey = "mail:code:" + verifyCode.getEmail();
            String cached = template.opsForValue().get(codeKey);
            if (cached == null) {
                throw new CustomException(
                        new ResponseMessageDto("The code has expired or was never sent.", HttpStatus.BAD_REQUEST),
                        HttpStatus.BAD_REQUEST
                );
            }

            //limiting request time if invalid code
            log.info("limiting request time if invalid code");
            if (!cached.equals(verifyCode.getCode())) {
                String attemptsKey = "mail:attempts:" + ip;
                Long fails = template.opsForValue().increment(attemptsKey);
                if (fails == 1L) {
                    template.expire(attemptsKey, COUNT_TTL);
                }

                if (fails >= 5) {
                    template.opsForValue().set(banKey, "1", Duration.ofMinutes(20));
                    template.delete(attemptsKey);
                    throw new CustomException(
                            new ResponseMessageDto("Too many request, try again in 20 minutes", HttpStatus.TOO_MANY_REQUESTS),
                            HttpStatus.TOO_MANY_REQUESTS
                    );
                }

                throw new CustomException(
                        new ResponseMessageDto("Invalid verification code. You have failed " + fails + " times.", HttpStatus.BAD_REQUEST),
                        HttpStatus.BAD_REQUEST
                );
            }

            //if code is true then delete
            log.info("code true, deleting cache");
            template.delete(codeKey);
            template.delete("mail:attempts:" + ip);

            //update password
            log.info("updating new password");

            UserEntity user = userRepository.findUserByEmail(verifyCode.getEmail())
                    .orElseThrow(
                            () -> new CustomException(new ResponseMessageDto("No user found with email: " + verifyCode.getEmail(), HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST)
                    );
            user.setPassword(passwordEncoder.encode(verifyCode.getNewPassword()));
            userRepository.save(user);

            return "Password updated successfully";
        } catch (CustomException e) {
            throw new CustomException(new ResponseMessageDto(e.getMessage(), e.getStatus()), e.getStatus());
        }
    }


}
