package com.vuong.communityportalservice.service.implementation;

import com.vuong.communityportalservice.dto.ArticleActorDto;
import com.vuong.communityportalservice.dto.ArticleDto;
import com.vuong.communityportalservice.dto.DoctorDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.entity.ArticleEntity;
import com.vuong.communityportalservice.enums.ArticleCategory;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.networkmanager.DoctorServiceFeignClient;
import com.vuong.communityportalservice.repository.ArticleBookmarkRepository;
import com.vuong.communityportalservice.repository.ArticleCommentRepository;
import com.vuong.communityportalservice.repository.ArticleLikeRepository;
import com.vuong.communityportalservice.repository.ArticleRepository;
import com.vuong.communityportalservice.service.ArticleService;
import com.vuong.communityportalservice.service.support.ArticleActorResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ArticleServiceImplementation implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleLikeRepository articleLikeRepository;

    @Autowired
    private ArticleBookmarkRepository articleBookmarkRepository;

    @Autowired
    private ArticleCommentRepository articleCommentRepository;

    @Autowired
    private DoctorServiceFeignClient doctorServiceFeignClient;

    @Autowired
    private ArticleActorResolver articleActorResolver;

    @Override
    public ArticleDto createArticle(ArticleDto articleDto) throws CustomException {
        log.info("Creating article: {}", articleDto.getTitle());
        DoctorDto doctor = getAndValidateCurrentDoctor();

        validateArticleFields(articleDto);

        ArticleEntity entity = new ArticleEntity();
        entity.setDoctorId(doctor.getDoctorId());
        entity.setTitle(articleDto.getTitle());
        entity.setContent(articleDto.getContent());
        entity.setCategory(articleDto.getCategory());
        entity.setThumbnailUrl(articleDto.getThumbnailUrl());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setActive(true);

        ArticleEntity saved = articleRepository.save(entity);
        log.info("Article created with id: {}", saved.getArticleId());

        return mapToDto(saved, doctor, null);
    }

    @Override
    public ArticleDto updateArticle(ArticleDto articleDto) throws CustomException {
        log.info("Updating article: {}", articleDto.getArticleId());
        DoctorDto doctor = getAndValidateCurrentDoctor();

        ArticleEntity entity = articleRepository.findByArticleIdAndIsActiveTrue(articleDto.getArticleId())
                .orElseThrow(() -> new CustomException(
                        new ResponseMessageDto("Article not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND));

        if (!entity.getDoctorId().equals(doctor.getDoctorId())) {
            throw new CustomException(
                    new ResponseMessageDto("You are not authorized to update this article", HttpStatus.FORBIDDEN),
                    HttpStatus.FORBIDDEN);
        }

        validateArticleFields(articleDto);

        entity.setTitle(articleDto.getTitle());
        entity.setContent(articleDto.getContent());
        entity.setCategory(articleDto.getCategory());
        entity.setThumbnailUrl(articleDto.getThumbnailUrl());
        entity.setUpdatedAt(LocalDateTime.now());

        ArticleEntity saved = articleRepository.save(entity);
        log.info("Article updated: {}", saved.getArticleId());

        return mapToDto(saved, doctor, null);
    }

    @Override
    public void deleteArticle(Long articleId) throws CustomException {
        log.info("Deleting article: {}", articleId);
        DoctorDto doctor = getAndValidateCurrentDoctor();

        ArticleEntity entity = articleRepository.findByArticleIdAndIsActiveTrue(articleId)
                .orElseThrow(() -> new CustomException(
                        new ResponseMessageDto("Article not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND));

        if (!entity.getDoctorId().equals(doctor.getDoctorId())) {
            throw new CustomException(
                    new ResponseMessageDto("You are not authorized to delete this article", HttpStatus.FORBIDDEN),
                    HttpStatus.FORBIDDEN);
        }

        entity.setActive(false);
        articleRepository.save(entity);
        log.info("Article soft-deleted: {}", articleId);
    }

    @Override
    public ArticleDto getArticleById(Long articleId) throws CustomException {
        log.info("Getting article by id: {}", articleId);
        ArticleEntity entity = articleRepository.findByArticleIdAndIsActiveTrue(articleId)
                .orElseThrow(() -> new CustomException(
                        new ResponseMessageDto("Article not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND));

        ArticleActorDto currentActor = articleActorResolver.getCurrentActorIfAvailable().orElse(null);
        return mapToDto(entity, fetchDoctorInfo(entity.getDoctorId()), currentActor);
    }

    @Override
    public List<ArticleDto> getAllArticles() throws CustomException {
        log.info("Getting all articles");
        List<ArticleEntity> articles = articleRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        ArticleActorDto currentActor = articleActorResolver.getCurrentActorIfAvailable().orElse(null);
        return articles.stream().map(a -> mapToDtoSafe(a, currentActor)).collect(Collectors.toList());
    }

    @Override
    public List<ArticleDto> getArticlesByCategory(ArticleCategory category) throws CustomException {
        log.info("Getting articles by category: {}", category);
        List<ArticleEntity> articles = articleRepository.findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(category);
        ArticleActorDto currentActor = articleActorResolver.getCurrentActorIfAvailable().orElse(null);
        return articles.stream().map(a -> mapToDtoSafe(a, currentActor)).collect(Collectors.toList());
    }

    @Override
    public List<ArticleDto> getArticlesByDoctor(String doctorId) throws CustomException {
        log.info("Getting articles by doctor: {}", doctorId);
        List<ArticleEntity> articles = articleRepository.findByDoctorIdAndIsActiveTrueOrderByCreatedAtDesc(doctorId);
        ArticleActorDto currentActor = articleActorResolver.getCurrentActorIfAvailable().orElse(null);
        return articles.stream().map(a -> mapToDtoSafe(a, currentActor)).collect(Collectors.toList());
    }

    @Override
    public List<ArticleDto> searchArticles(String keyword) throws CustomException {
        log.info("Searching articles with keyword: {}", keyword);
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllArticles();
        }
        List<ArticleEntity> articles = articleRepository.searchByKeyword(keyword.trim());
        ArticleActorDto currentActor = articleActorResolver.getCurrentActorIfAvailable().orElse(null);
        return articles.stream().map(a -> mapToDtoSafe(a, currentActor)).collect(Collectors.toList());
    }

    // ==================== HELPER METHODS ====================

    private DoctorDto getAndValidateCurrentDoctor() throws CustomException {
        try {
            ResponseEntity<DoctorDto> response = doctorServiceFeignClient.getCurrentDoctor();
            if (response.getBody() == null || response.getStatusCode() != HttpStatus.OK) {
                throw new CustomException(
                        new ResponseMessageDto("You are not authorized", HttpStatus.UNAUTHORIZED),
                        HttpStatus.UNAUTHORIZED);
            }
            if (!response.getBody().isApproved()) {
                throw new CustomException(
                        new ResponseMessageDto("Doctor account is not approved", HttpStatus.FORBIDDEN),
                        HttpStatus.FORBIDDEN);
            }
            return response.getBody();
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching current doctor: {}", e.getMessage());
            throw new CustomException(
                    new ResponseMessageDto("Unable to verify doctor identity", HttpStatus.UNAUTHORIZED),
                    HttpStatus.UNAUTHORIZED);
        }
    }

    private DoctorDto fetchDoctorInfo(String doctorId) {
        try {
            ResponseEntity<DoctorDto> response = doctorServiceFeignClient.getDoctorById(doctorId);
            if (response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("Could not fetch doctor info for id: {}", doctorId);
        }
        return null;
    }

    private void validateArticleFields(ArticleDto dto) throws CustomException {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new CustomException(
                    new ResponseMessageDto("Article title cannot be empty", HttpStatus.BAD_REQUEST),
                    HttpStatus.BAD_REQUEST);
        }
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new CustomException(
                    new ResponseMessageDto("Article content cannot be empty", HttpStatus.BAD_REQUEST),
                    HttpStatus.BAD_REQUEST);
        }
        if (dto.getCategory() == null) {
            throw new CustomException(
                    new ResponseMessageDto("Article category is required", HttpStatus.BAD_REQUEST),
                    HttpStatus.BAD_REQUEST);
        }

        String trimmedTitle = dto.getTitle().trim();
        if (trimmedTitle.length() > 250) {
            throw new CustomException(
                    new ResponseMessageDto("Article title cannot exceed 250 characters", HttpStatus.BAD_REQUEST),
                    HttpStatus.BAD_REQUEST);
        }

        String normalizedThumbnailUrl = dto.getThumbnailUrl() == null ? null : dto.getThumbnailUrl().trim();
        if (normalizedThumbnailUrl != null && !normalizedThumbnailUrl.isEmpty()) {
            String normalizedThumbnailUrlLowerCase = normalizedThumbnailUrl.toLowerCase(Locale.ROOT);
            boolean supportedThumbnailFormat = normalizedThumbnailUrlLowerCase.startsWith("http://")
                    || normalizedThumbnailUrlLowerCase.startsWith("https://")
                    || normalizedThumbnailUrlLowerCase.startsWith("data:image/");

            if (!supportedThumbnailFormat) {
                throw new CustomException(
                        new ResponseMessageDto(
                                "Thumbnail must be an http(s) URL or a valid data:image payload",
                                HttpStatus.BAD_REQUEST),
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            normalizedThumbnailUrl = null;
        }

        dto.setTitle(trimmedTitle);
        dto.setContent(dto.getContent().trim());
        dto.setThumbnailUrl(normalizedThumbnailUrl);
    }

    private ArticleDto mapToDto(ArticleEntity entity, DoctorDto doctor, ArticleActorDto currentActor) {
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

        if (doctor != null) {
            dto.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());
            dto.setDoctorDepartment(doctor.getDepartment());
        }

        dto.setLikeCount(articleLikeRepository.countByArticleId(entity.getArticleId()));
        dto.setCommentCount(articleCommentRepository.findByArticleIdAndIsActiveTrueOrderByCreatedAtDesc(
                entity.getArticleId()).size());

        if (currentActor != null) {
            dto.setLikedByCurrentUser(articleLikeRepository.existsByArticleIdAndActorIdAndActorType(
                    entity.getArticleId(), currentActor.getActorId(), currentActor.getActorType()));
            dto.setBookmarkedByCurrentUser(articleBookmarkRepository.existsByArticleIdAndActorIdAndActorType(
                    entity.getArticleId(), currentActor.getActorId(), currentActor.getActorType()));
        }

        return dto;
    }

    private ArticleDto mapToDtoSafe(ArticleEntity entity, ArticleActorDto currentActor) {
        DoctorDto doctor = fetchDoctorInfo(entity.getDoctorId());
        return mapToDto(entity, doctor, currentActor);
    }
}
