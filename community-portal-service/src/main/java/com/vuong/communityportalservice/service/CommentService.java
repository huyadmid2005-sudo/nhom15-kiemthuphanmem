package com.vuong.communityportalservice.service;

import com.vuong.communityportalservice.dto.CommentDto;
import com.vuong.communityportalservice.exception.CustomException;

import java.util.List;

public interface CommentService {
    void createComment(CommentDto commentDto) throws CustomException;
    void updateComment(CommentDto commentDto) throws CustomException;
    void deleteComment(Long commentId) throws CustomException;
    CommentDto getCommentById(Long commentId) throws CustomException;
    List<CommentDto> getAllCommentsByPostId(Long postId) throws CustomException;
}
