package com.vuong.communityportalservice.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vuong.communityportalservice.dto.PatientDto;
import com.vuong.communityportalservice.dto.PostDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.dto.UploadFileResponseDto;
import com.vuong.communityportalservice.entity.PostEntity;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.networkmanager.PatientServiceFeignClient;
import com.vuong.communityportalservice.repository.PostRepository;
import com.vuong.communityportalservice.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PostServiceImplementation implements PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private PatientServiceFeignClient patientServiceFeignClient;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public void createPost(PostDto postDto) throws CustomException {
        try {
            log.info("inside createPost method of PostServiceImplementation");
            ResponseEntity<PatientDto> patientDtoResponse = patientServiceFeignClient.getCurrentPatient();


            if(patientDtoResponse.getBody() == null || patientDtoResponse.getStatusCode() != HttpStatus.OK) {

                throw new CustomException(new ResponseMessageDto("You are not authorized to create a post HEY", HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
            }
            //check if the patient is approved
            if(!patientDtoResponse.getBody().isApproved()){
                throw new CustomException(new ResponseMessageDto("You are not authorized to create a post W", HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
            }
            if(postDto.getPostTitle() == null || postDto.getPostContent() == null){
                throw new CustomException(new ResponseMessageDto("Post title and content cannot be null", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }
            if(Objects.equals(postDto.getPostTitle(), "") || Objects.equals(postDto.getPostContent(), "")){
                throw new CustomException(new ResponseMessageDto("Post title and content cannot be empty", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }
            if(postDto.getPostTitle().length() > 100 || postDto.getPostTitle().length() < 5){
                throw new CustomException(new ResponseMessageDto("Post title must be between 5 and 100 characters", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }
            if(postDto.getPostContent().length() > 500000 || postDto.getPostContent().length() < 10){
                throw new CustomException(new ResponseMessageDto("Post content must be between 10 and 500000 characters", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }

            PostEntity postEntity = new PostEntity();
            postEntity.setPostTitle(postDto.getPostTitle());
            postEntity.setPostContent(postDto.getPostContent());
            postEntity.setCreatedAt(LocalDateTime.now());
            postEntity.setActive(true);
            postEntity.setPatientId(patientDtoResponse.getBody().getPatientId());
            postRepository.save(postEntity);
            log.info("post created successfully");
        } catch(CustomException ex) {
            log.error("error occurred while creating post: " + ex.getMessage());
            throw ex;
        }
    }

    @Override
    public PostDto getPostById(Long postId) throws CustomException {
        try{
            log.info("inside getPostById method of PostServiceImplementation");
            Optional<PostEntity> postEntity = postRepository.findById(postId);
            if(postEntity.isEmpty() || !postEntity.get().isActive()){
                throw new CustomException(new ResponseMessageDto("Post not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
            }

            return modelMapper.map(postEntity, PostDto.class);
        } catch (CustomException ex) {
            log.error("error occurred while fetching post: " + ex.getMessage());
            throw ex;
        }
    }

    @Override
    public List<PostDto> getAllPosts() throws CustomException {
        try{
            log.info("inside getAllPosts method of PostServiceImplementation");
            List<PostEntity> postEntities = postRepository.findAll();

            if (postEntities.isEmpty()) {
                throw new CustomException(
                        new ResponseMessageDto("No posts found", HttpStatus.NOT_FOUND),
                        HttpStatus.NOT_FOUND);
            }

            return postEntities.stream()
                    .filter(PostEntity::isActive)
                    .sorted(Comparator.comparing(PostEntity::getCreatedAt).reversed())
                    .map(postEntity -> modelMapper.map(postEntity, PostDto.class))
                    .collect(Collectors.toList());
        } catch (CustomException ex) {
            log.error("error occurred while fetching posts: " + ex.getMessage());
            throw ex;
        }
    }

    @Override
    public void updatePost(PostDto postDto) throws CustomException {
        try{
            log.info("inside updatePost method of PostServiceImplementation");
            ResponseEntity<PatientDto> patientDtoResponse = patientServiceFeignClient.getCurrentPatient();
            if(patientDtoResponse.getBody() == null || patientDtoResponse.getStatusCode() != HttpStatus.OK) {
                throw new CustomException(new ResponseMessageDto("You are not authorized to update the post", HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
            }

            Optional<PostEntity> postEntity = postRepository.findById(postDto.getPostId());
            if(postEntity.isEmpty() || !postEntity.get().isActive()){
                throw new CustomException(new ResponseMessageDto("Post not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
            }

            // check if the post belongs to the user
            if(!postEntity.get().getPatientId().equals(patientDtoResponse.getBody().getPatientId())){
                throw new CustomException(new ResponseMessageDto("You are not authorized to update the post", HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
            }
            log.info("All validations passed, updating post");

            PostEntity updatedPostEntity = postEntity.get();
            updatedPostEntity.setPostTitle(postDto.getPostTitle() != null ? postDto.getPostTitle() : updatedPostEntity.getPostTitle());
            updatedPostEntity.setPostContent(postDto.getPostContent() != null ? postDto.getPostContent() : updatedPostEntity.getPostContent());
            updatedPostEntity.setActive(true);

            postRepository.save(updatedPostEntity);
            log.info("post updated successfully");
        } catch (CustomException ex) {
            log.error("error occurred while updating post: " + ex.getMessage());
            throw ex;
        }
    }

    @Override
    public void deletePost(Long postId) throws CustomException {
        // will be implemented later
    }

    @Override
    public UploadFileResponseDto upload(MultipartFile file) throws CustomException {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            if (originalFilename.contains("..")) {
                throw new CustomException(new ResponseMessageDto("Invalid path sequence in filename.", HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
            }

            LocalDate today = LocalDate.now();
            String folder = String.format("%d/%02d/%02d",
                    today.getYear(),
                    today.getMonthValue(),
                    today.getDayOfMonth()
                    );

            String publicId = folder + "/" + originalFilename;

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "public_id", publicId,
                            "overwrite", true
                    )
            );

            String downloadUrl = (String) uploadResult.get("secure_url");
            long size = ((Number) uploadResult.get("bytes")).longValue();

            return UploadFileResponseDto.builder()
                    .fileUrl(downloadUrl)
                    .filePath(downloadUrl)
                    .fileType(StringUtils.getFilenameExtension(originalFilename))
                    .fileSize(size)
                    .fileName(originalFilename)
                    .build();

        } catch (CustomException ex) {
            log.error("error occurred while uploading file: " + ex.getMessage());
            throw ex;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
