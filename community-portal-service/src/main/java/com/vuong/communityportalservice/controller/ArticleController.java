package com.vuong.communityportalservice.controller;

import com.vuong.communityportalservice.dto.ArticleCommentDto;
import com.vuong.communityportalservice.dto.ArticleDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.enums.ArticleCategory;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.service.ArticleBookmarkService;
import com.vuong.communityportalservice.service.ArticleCommentService;
import com.vuong.communityportalservice.service.ArticleLikeService;
import com.vuong.communityportalservice.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/community-portal/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ArticleLikeService articleLikeService;

    @Autowired
    private ArticleBookmarkService articleBookmarkService;

    @Autowired
    private ArticleCommentService articleCommentService;

    // ==================== ARTICLE CRUD (Doctor) ====================

    @PostMapping("/create")
    public ResponseEntity<ArticleDto> createArticle(@RequestBody ArticleDto articleDto)
            throws CustomException {
        log.info("Received request to create article");
        ArticleDto created = articleService.createArticle(articleDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<ArticleDto> updateArticle(@RequestBody ArticleDto articleDto)
            throws CustomException {
        log.info("Received request to update article: {}", articleDto.getArticleId());
        ArticleDto updated = articleService.updateArticle(articleDto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<ResponseMessageDto> deleteArticle(@PathVariable Long articleId)
            throws CustomException {
        log.info("Received request to delete article: {}", articleId);
        articleService.deleteArticle(articleId);
        return new ResponseEntity<>(
                new ResponseMessageDto("Article deleted successfully", HttpStatus.OK), HttpStatus.OK);
    }

    // ==================== ARTICLE READ (Any authenticated) ====================

    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long articleId)
            throws CustomException {
        log.info("Received request to get article: {}", articleId);
        ArticleDto article = articleService.getArticleById(articleId);
        return new ResponseEntity<>(article, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArticleDto>> getAllArticles() throws CustomException {
        log.info("Received request to get all articles");
        List<ArticleDto> articles = articleService.getAllArticles();
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ArticleDto>> getArticlesByCategory(@PathVariable ArticleCategory category)
            throws CustomException {
        log.info("Received request to get articles by category: {}", category);
        List<ArticleDto> articles = articleService.getArticlesByCategory(category);
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<ArticleDto>> getArticlesByDoctor(@PathVariable String doctorId)
            throws CustomException {
        log.info("Received request to get articles by doctor: {}", doctorId);
        List<ArticleDto> articles = articleService.getArticlesByDoctor(doctorId);
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ArticleDto>> searchArticles(@RequestParam String keyword)
            throws CustomException {
        log.info("Received request to search articles: {}", keyword);
        List<ArticleDto> articles = articleService.searchArticles(keyword);
        return new ResponseEntity<>(articles, HttpStatus.OK);
    }

    // ==================== LIKE (Patient) ====================

    @PostMapping("/like/{articleId}")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long articleId)
            throws CustomException {
        log.info("Received request to toggle like for article: {}", articleId);
        boolean liked = articleLikeService.toggleLike(articleId);
        long likeCount = articleLikeService.getLikeCount(articleId);
        return new ResponseEntity<>(Map.of("liked", liked, "likeCount", likeCount), HttpStatus.OK);
    }

    // ==================== BOOKMARK (Patient) ====================

    @PostMapping("/bookmark/{articleId}")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable Long articleId)
            throws CustomException {
        log.info("Received request to toggle bookmark for article: {}", articleId);
        boolean bookmarked = articleBookmarkService.toggleBookmark(articleId);
        return new ResponseEntity<>(Map.of("bookmarked", bookmarked), HttpStatus.OK);
    }

    @GetMapping("/bookmarks/my")
    public ResponseEntity<List<ArticleDto>> getMyBookmarks() throws CustomException {
        log.info("Received request to get my bookmarks");
        List<ArticleDto> bookmarks = articleBookmarkService.getBookmarkedArticles();
        return new ResponseEntity<>(bookmarks, HttpStatus.OK);
    }

    // ==================== COMMENT (Patient) ====================

    @PostMapping("/comment")
    public ResponseEntity<ArticleCommentDto> createComment(@RequestBody ArticleCommentDto commentDto)
            throws CustomException {
        log.info("Received request to create comment for article: {}", commentDto.getArticleId());
        ArticleCommentDto created = articleCommentService.createComment(commentDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{articleId}/comments")
    public ResponseEntity<List<ArticleCommentDto>> getCommentsByArticle(@PathVariable Long articleId)
            throws CustomException {
        log.info("Received request to get comments for article: {}", articleId);
        List<ArticleCommentDto> comments = articleCommentService.getCommentsByArticle(articleId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<ResponseMessageDto> deleteComment(@PathVariable Long commentId)
            throws CustomException {
        log.info("Received request to delete comment: {}", commentId);
        articleCommentService.deleteComment(commentId);
        return new ResponseEntity<>(
                new ResponseMessageDto("Comment deleted successfully", HttpStatus.OK), HttpStatus.OK);
    }
}
