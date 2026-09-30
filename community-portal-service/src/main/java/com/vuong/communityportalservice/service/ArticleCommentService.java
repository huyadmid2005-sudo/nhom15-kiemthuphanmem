package com.vuong.communityportalservice.service;

import com.vuong.communityportalservice.dto.ArticleCommentDto;
import com.vuong.communityportalservice.exception.CustomException;

import java.util.List;

public interface ArticleCommentService {

    ArticleCommentDto createComment(ArticleCommentDto commentDto) throws CustomException;

    List<ArticleCommentDto> getCommentsByArticle(Long articleId) throws CustomException;

    void deleteComment(Long commentId) throws CustomException;
}
