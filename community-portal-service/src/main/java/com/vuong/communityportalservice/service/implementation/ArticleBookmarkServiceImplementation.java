package com.vuong.communityportalservice.service.implementation;

import com.vuong.communityportalservice.dto.ArticleActorDto;
import com.vuong.communityportalservice.dto.ArticleDto;
import com.vuong.communityportalservice.dto.DoctorDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.entity.ArticleBookmarkEntity;
import com.vuong.communityportalservice.entity.ArticleEntity;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.networkmanager.DoctorServiceFeignClient;
import com.vuong.communityportalservice.repository.ArticleCommentRepository;
import com.vuong.communityportalservice.repository.ArticleBookmarkRepository;
import com.vuong.communityportalservice.repository.ArticleLikeRepository;
import com.vuong.communityportalservice.repository.ArticleRepository;
import com.vuong.communityportalservice.service.ArticleBookmarkService;
import com.vuong.communityportalservice.service.support.ArticleActorResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ArticleBookmarkServiceImplementation implements ArticleBookmarkService {

    @Autowired
    private ArticleBookmarkRepository articleBookmarkRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleLikeRepository articleLikeRepository;

    @Autowired
    private ArticleCommentRepository articleCommentRepository;

    @Autowired
    private DoctorServiceFeignClient doctorServiceFeignClient;

    @Autowired
    private ArticleActorResolver articleActorResolver;

    @Override
    public boolean toggleBookmark(Long articleId) throws CustomException {
        log.info("Toggling bookmark for article: {}", articleId);
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();

        Optional<ArticleBookmarkEntity> existing =
                articleBookmarkRepository.findByArticleIdAndActorIdAndActorType(
                        articleId, actor.getActorId(), actor.getActorType());

        if (existing.isPresent()) {
            articleBookmarkRepository.delete(existing.get());
            log.info("Bookmark removed for article: {} by actor: {}", articleId, actor.getActorId());
            return false;
        } else {
            ArticleBookmarkEntity bookmark = new ArticleBookmarkEntity();
            bookmark.setArticleId(articleId);
            bookmark.setActorId(actor.getActorId());
            bookmark.setActorType(actor.getActorType());
            bookmark.setCreatedAt(LocalDateTime.now());
            articleBookmarkRepository.save(bookmark);
            log.info("Bookmark added for article: {} by actor: {}", articleId, actor.getActorId());
            return true;
        }
    }

    @Override
    public List<ArticleDto> getBookmarkedArticles() throws CustomException {
        log.info("Getting bookmarked articles");
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();

        List<ArticleBookmarkEntity> bookmarks =
                articleBookmarkRepository.findByActorIdAndActorTypeOrderByCreatedAtDesc(
                        actor.getActorId(), actor.getActorType());

        List<ArticleDto> result = new ArrayList<>();
        for (ArticleBookmarkEntity bookmark : bookmarks) {
            Optional<ArticleEntity> articleOpt = articleRepository.findByArticleIdAndIsActiveTrue(bookmark.getArticleId());
            articleOpt.ifPresent(article -> {
                ArticleDto dto = mapToDto(article, actor);
                result.add(dto);
            });
        }
        return result;
    }

    @Override
    public boolean isBookmarkedByCurrentActor(Long articleId) throws CustomException {
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();
        return articleBookmarkRepository.existsByArticleIdAndActorIdAndActorType(
                articleId, actor.getActorId(), actor.getActorType());
    }

    private ArticleDto mapToDto(ArticleEntity entity, ArticleActorDto actor) {
        ArticleDto dto = new ArticleDto();
        dto.setArticleId(entity.getArticleId());
        dto.setDoctorId(entity.getDoctorId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setCategory(entity.getCategory());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setActive(entity.isActive());

        try {
            ResponseEntity<DoctorDto> doctorResponse = doctorServiceFeignClient.getDoctorById(entity.getDoctorId());
            if (doctorResponse.getBody() != null) {
                DoctorDto doctor = doctorResponse.getBody();
                dto.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());
                dto.setDoctorDepartment(doctor.getDepartment());
            }
        } catch (Exception e) {
            log.warn("Could not fetch doctor info for id: {}", entity.getDoctorId());
        }

        dto.setLikeCount(articleLikeRepository.countByArticleId(entity.getArticleId()));
        dto.setCommentCount(articleCommentRepository.findByArticleIdAndIsActiveTrueOrderByCreatedAtDesc(
                entity.getArticleId()).size());
        dto.setLikedByCurrentUser(articleLikeRepository.existsByArticleIdAndActorIdAndActorType(
                entity.getArticleId(), actor.getActorId(), actor.getActorType()));
        dto.setBookmarkedByCurrentUser(true);

        return dto;
    }
}
