package com.vuong.communityportalservice.networkmanager;

import com.vuong.communityportalservice.constants.AppConstants;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@Slf4j
public class TokenInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        String authorizationHeader = retrieveAuthorizationHeader();

        if (authorizationHeader != null && !authorizationHeader.isBlank()) {
            String headerValue = authorizationHeader.startsWith(AppConstants.TOKEN_PREFIX)
                    ? authorizationHeader
                    : AppConstants.TOKEN_PREFIX + authorizationHeader;
            requestTemplate.header(AppConstants.HEADER_STRING, headerValue);
        }
    }

    private String retrieveAuthorizationHeader() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }

        HttpServletRequest request = attributes.getRequest();
        return request.getHeader(AppConstants.HEADER_STRING);
    }
}
