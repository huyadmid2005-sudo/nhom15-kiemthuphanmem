package com.vuong.communityportalservice.service;

import com.vuong.communityportalservice.exception.CustomException;

public interface ArticleLikeService {

    boolean toggleLike(Long articleId) throws CustomException;

    long getLikeCount(Long articleId) throws CustomException;

    boolean isLikedByCurrentActor(Long articleId) throws CustomException;
}
