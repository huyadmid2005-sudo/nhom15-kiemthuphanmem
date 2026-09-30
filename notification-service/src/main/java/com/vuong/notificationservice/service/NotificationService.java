package com.vuong.notificationservice.service;

import com.vuong.notificationservice.dto.NotificationDto;
import com.vuong.notificationservice.exception.CustomException;

import java.util.List;

public interface NotificationService {
    void createNotification(NotificationDto notificationDto) throws CustomException;
    List<NotificationDto> getAllNotificationsByUserId(Long userId) throws CustomException;
    List<NotificationDto> getUnreadNotificationsByUserId(Long userId) throws CustomException;
    void markNotificationAsRead(Long notificationId) throws CustomException;
    void markAllNotificationsAsRead(Long userId) throws CustomException;
    void deleteNotification(Long notificationId) throws CustomException;
    void updateNotification(NotificationDto notificationDto) throws CustomException;
}
