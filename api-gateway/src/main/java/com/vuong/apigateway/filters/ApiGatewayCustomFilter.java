package com.vuong.apigateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class ApiGatewayCustomFilter implements GlobalFilter {
    Logger logger = LoggerFactory.getLogger(ApiGatewayCustomFilter.class);
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Global Pre Filter executed ");
        logger.info("Request Headers = " + sanitizeHeaders(exchange.getRequest().getHeaders()));
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            logger.info("Global Post Filter executed: " + exchange.getResponse().getStatusCode());
        }));
    }

    private Map<String, List<String>> sanitizeHeaders(MultiValueMap<String, String> headers) {
        Map<String, List<String>> sanitized = new LinkedHashMap<>();
        headers.forEach((key, value) -> {
            if (HttpHeaders.AUTHORIZATION.equalsIgnoreCase(key)
                    || "cookie".equalsIgnoreCase(key)
                    || "set-cookie".equalsIgnoreCase(key)) {
                sanitized.put(key, List.of("<redacted>"));
            } else {
                sanitized.put(key, value);
            }
        });
        return sanitized;
    }
}
