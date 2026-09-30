package com.vuong.securityservice.service;

import com.vuong.securityservice.dto.VerifyCodeDto;
import com.vuong.securityservice.exception.CustomException;

public interface RecoveryService {
    String sendMail(String email) throws CustomException;
    String verifyCode(VerifyCodeDto verifyCode) throws CustomException;
}
