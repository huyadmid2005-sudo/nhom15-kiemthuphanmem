package com.vuong.communityportalservice.controller;


import com.vuong.communityportalservice.dto.*;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.service.CommentService;
import com.vuong.communityportalservice.service.PostService;
import com.vuong.communityportalservice.service.VoteService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/community-portal")
public class CommunityPortalController {
    @Autowired
    private PostService postService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private VoteService voteService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws CustomException {
        log.info("inside uploadFile method of CommunityPortalController");
        return new ResponseEntity<>(postService.upload(file), HttpStatus.OK);
    }


    @PostMapping("/posts/create")
    public ResponseEntity<ResponseMessageDto> createPost(@Valid @RequestBody PostDto postDto)
            throws CustomException {
        log.info("inside createPost method of CommunityPortalController");
        postService.createPost(postDto);
        log.info("post created successfully");
        return new ResponseEntity<>(new ResponseMessageDto("Post created successfully", HttpStatus.CREATED), HttpStatus.CREATED);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long postId)
            throws CustomException {
        log.info("inside getPostById method of CommunityPortalController");
        PostDto postDto = postService.getPostById(postId);
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostDto>> getAllPosts()
            throws CustomException {
        log.info("inside getAllPosts method of CommunityPortalController");
        List<PostDto> postsDtoList = postService.getAllPosts();
        return new ResponseEntity<>(postsDtoList, HttpStatus.OK);
    }

    @PutMapping("/posts/update")
    public ResponseEntity<ResponseMessageDto> updatePost(@Valid @RequestBody PostDto postDto)
            throws CustomException {
        log.info("inside updatePost method of CommunityPortalController");
        postService.updatePost(postDto);
        log.info("post updated successfully");
        return new ResponseEntity<>(new ResponseMessageDto("Post updated successfully", HttpStatus.OK), HttpStatus.OK);
    }

    @PostMapping("/comments/create")
    public ResponseEntity<ResponseMessageDto> createComment(@Valid @RequestBody CommentDto commentDto)
            throws CustomException {
        log.info("inside createComment method of CommunityPortalController");
        commentService.createComment(commentDto);
        log.info("comment created successfully");
        return new ResponseEntity<>(new ResponseMessageDto("Comment created successfully", HttpStatus.CREATED), HttpStatus.CREATED);
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long commentId)
            throws CustomException {
        log.info("inside getCommentById method of CommunityPortalController");
        CommentDto commentDto = commentService.getCommentById(commentId);
        return new ResponseEntity<>(commentDto, HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getAllCommentsByPostId(@PathVariable Long postId)
            throws CustomException {
        log.info("inside getAllCommentsByPostId method of CommunityPortalController");
        List<CommentDto> commentsDtoList = commentService.getAllCommentsByPostId(postId);
        return new ResponseEntity<>(commentsDtoList, HttpStatus.OK);
    }

    @PostMapping("/posts/vote")
    public ResponseEntity<ResponseMessageDto> castVote(@Valid @RequestBody VoteDto voteDto)
            throws CustomException {
        log.info("inside castVote method of CommunityPortalController");
        voteService.castVote(voteDto);
        log.info("vote casted successfully");
        return new ResponseEntity<>(new ResponseMessageDto("Voted successfully", HttpStatus.CREATED), HttpStatus.CREATED);
    }

    @GetMapping("/posts/{postId}/votes/count")
    public ResponseEntity<VoteCountDto> countVotes(@PathVariable Long postId)
            throws CustomException {
        log.info("inside countVotes method of CommunityPortalController");
        VoteCountDto voteCountDto = voteService.countVotes(postId);
        return new ResponseEntity<>(voteCountDto, HttpStatus.OK);
    }
}
