package com.vuong.communityportalservice.service;

import com.vuong.communityportalservice.dto.ArticleDto;
import com.vuong.communityportalservice.exception.CustomException;

import java.util.List;

public interface ArticleBookmarkService {

    boolean toggleBookmark(Long articleId) throws CustomException;

    List<ArticleDto> getBookmarkedArticles() throws CustomException;

    boolean isBookmarkedByCurrentActor(Long articleId) throws CustomException;
}
