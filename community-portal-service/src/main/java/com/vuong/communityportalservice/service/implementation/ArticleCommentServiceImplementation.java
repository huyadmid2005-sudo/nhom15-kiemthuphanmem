package com.vuong.communityportalservice.service.implementation;

import com.vuong.communityportalservice.dto.ArticleActorDto;
import com.vuong.communityportalservice.dto.ArticleCommentDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.entity.ArticleCommentEntity;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.repository.ArticleCommentRepository;
import com.vuong.communityportalservice.service.ArticleCommentService;
import com.vuong.communityportalservice.service.support.ArticleActorResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ArticleCommentServiceImplementation implements ArticleCommentService {

    @Autowired
    private ArticleCommentRepository articleCommentRepository;

    @Autowired
    private ArticleActorResolver articleActorResolver;

    @Override
    public ArticleCommentDto createComment(ArticleCommentDto commentDto) throws CustomException {
        log.info("Creating comment for article: {}", commentDto.getArticleId());
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();

        if (commentDto.getContent() == null || commentDto.getContent().trim().isEmpty()) {
            throw new CustomException(
                    new ResponseMessageDto("Comment content cannot be empty", HttpStatus.BAD_REQUEST),
                    HttpStatus.BAD_REQUEST);
        }

        ArticleCommentEntity entity = new ArticleCommentEntity();
        entity.setArticleId(commentDto.getArticleId());
        entity.setActorId(actor.getActorId());
        entity.setActorType(actor.getActorType());
        entity.setContent(commentDto.getContent());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setActive(true);

        ArticleCommentEntity saved = articleCommentRepository.save(entity);
        log.info("Comment created with id: {}", saved.getCommentId());

        return mapToDto(saved, actor.getActorName());
    }

    @Override
    public List<ArticleCommentDto> getCommentsByArticle(Long articleId) throws CustomException {
        log.info("Getting comments for article: {}", articleId);
        List<ArticleCommentEntity> comments =
                articleCommentRepository.findByArticleIdAndIsActiveTrueOrderByCreatedAtDesc(articleId);

        return comments.stream().map(c -> {
            ArticleCommentDto dto = new ArticleCommentDto();
            dto.setCommentId(c.getCommentId());
            dto.setArticleId(c.getArticleId());
            dto.setActorId(c.getActorId());
            dto.setActorType(c.getActorType());
            dto.setContent(c.getContent());
            dto.setCreatedAt(c.getCreatedAt());
            dto.setActive(c.isActive());
            dto.setActorName(articleActorResolver.resolveActorName(c.getActorId(), c.getActorType()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentId) throws CustomException {
        log.info("Deleting comment: {}", commentId);
        ArticleActorDto actor = articleActorResolver.getRequiredCurrentActor();

        ArticleCommentEntity entity = articleCommentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(
                        new ResponseMessageDto("Comment not found", HttpStatus.NOT_FOUND),
                        HttpStatus.NOT_FOUND));

        if (!entity.getActorId().equals(actor.getActorId()) || entity.getActorType() != actor.getActorType()) {
            throw new CustomException(
                    new ResponseMessageDto("You are not authorized to delete this comment", HttpStatus.FORBIDDEN),
                    HttpStatus.FORBIDDEN);
        }

        entity.setActive(false);
        articleCommentRepository.save(entity);
        log.info("Comment soft-deleted: {}", commentId);
    }

    private ArticleCommentDto mapToDto(ArticleCommentEntity entity, String actorName) {
        ArticleCommentDto dto = new ArticleCommentDto();
        dto.setCommentId(entity.getCommentId());
        dto.setArticleId(entity.getArticleId());
        dto.setActorId(entity.getActorId());
        dto.setActorType(entity.getActorType());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setActive(entity.isActive());
        dto.setActorName(actorName);
        return dto;
    }
}
