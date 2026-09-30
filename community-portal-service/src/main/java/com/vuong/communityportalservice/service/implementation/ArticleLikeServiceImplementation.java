package com.vuong.communityportalservice.service.implementation;

import com.vuong.communityportalservice.dto.ArticleActorDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.entity.ArticleLikeEntity;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.repository.ArticleLikeRepository;
import com.vuong.communityportalservice.service.ArticleLikeService;
import com.vuong.communityportalservice.service.support.ArticleActorResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class ArticleLikeServiceImplementation implements ArticleLikeService {

    @Autowired
    private ArticleLikeRepository articleLikeRepository;

    @Autowired
    private ArticleActorResolver articleActorResolver;

    @Override
    public boolean toggleLike(Long articleId) throws CustomException {
        log.info("Toggling like for article: {}", articleId);
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();

        Optional<ArticleLikeEntity> existingLike =
                articleLikeRepository.findByArticleIdAndActorIdAndActorType(
                        articleId, actor.getActorId(), actor.getActorType());

        if (existingLike.isPresent()) {
            articleLikeRepository.delete(existingLike.get());
            log.info("Like removed for article: {} by actor: {}", articleId, actor.getActorId());
            return false;
        } else {
            ArticleLikeEntity like = new ArticleLikeEntity();
            like.setArticleId(articleId);
            like.setActorId(actor.getActorId());
            like.setActorType(actor.getActorType());
            like.setCreatedAt(LocalDateTime.now());
            articleLikeRepository.save(like);
            log.info("Like added for article: {} by actor: {}", articleId, actor.getActorId());
            return true;
        }
    }

    @Override
    public long getLikeCount(Long articleId) throws CustomException {
        return articleLikeRepository.countByArticleId(articleId);
    }

    @Override
    public boolean isLikedByCurrentActor(Long articleId) throws CustomException {
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();
        return articleLikeRepository.existsByArticleIdAndActorIdAndActorType(
                articleId, actor.getActorId(), actor.getActorType());
    }
}
