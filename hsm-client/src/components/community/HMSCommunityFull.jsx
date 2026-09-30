import { useState, useEffect } from "react";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import { toast } from "react-toastify";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/PatientSidebar";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaFire,
  FaUser,
  FaPaperPlane,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/community.css";
import "../../styles/markdown-editor.css";

const HMSCommunityFull = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    postTitle: "",
    postContent: "",
    error: "",
  });
  const [newComment, setNewComment] = useState({
    postId: "",
    commentContent: "",
    error: "",
  });
  const [creatorName, setCreatorName] = useState("");
  const [currentPatientId, setCurrentPatientId] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPost, setEditPost] = useState({
    postTitle: "",
    postContent: "",
    error: "",
  });

  useEffect(() => {
    fetchPosts();
    fetchCreatorName();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCreatorName = async () => {
    try {
      const response = await axiosInstancePatientService.get("/profile");
      setCreatorName(`${response.data.firstName} ${response.data.lastName}`);
      setCurrentPatientId(response.data.patientId);
    } catch (error) {
      console.error("Error fetching creator's name:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axiosInstanceCommunityPortalService.get("/posts");
      const postsWithVotesPromises = response.data.map(async (post) => {
        try {
          const voteCountResponse =
            await axiosInstanceCommunityPortalService.get(
              `/posts/${post.postId}/votes/count`
            );
          const commentsResponse =
            await axiosInstanceCommunityPortalService.get(
              `/posts/${post.postId}/comments`
            );

          // Use comments as they are, without fetching individual patient profiles
          const commentsWithPatientInfo = commentsResponse.data.map(
            (comment) => ({
              ...comment,
              patientName: creatorName || "Community User",
              patientAvatar: null,
            })
          );

          return {
            ...post,
            comments: commentsWithPatientInfo,
            upVoteCount: voteCountResponse.data.upVoteCount,
            downVoteCount: voteCountResponse.data.downVoteCount,
          };
        } catch (error) {
          console.error(`Error fetching data for post ${post.postId}:`, error);
          return { ...post, comments: [], upVoteCount: 0, downVoteCount: 0 };
        }
      });
      const postsWithVotes = await Promise.all(postsWithVotesPromises);
      setPosts(postsWithVotes);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.postTitle || !newPost.postContent) {
      setNewPost({ ...newPost, error: "Both title and content are required." });
      return;
    }
    try {
      await axiosInstanceCommunityPortalService.post("/posts/create", {
        postTitle: newPost.postTitle,
        postContent: newPost.postContent,
      });
      setNewPost({ postTitle: "", postContent: "", error: "" });
      fetchPosts();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response.data.message || "Failed to create post.");
    }
  };

  const handleCreateComment = async (postId) => {
    const commentContent = newComment[postId] || "";
    if (!commentContent) {
      setNewComment({ ...newComment, [postId]: "Comment cannot be empty." });
      return;
    }
    try {
      await axiosInstanceCommunityPortalService.post("/comments/create", {
        postId,
        commentContent,
      });
      setNewComment({ ...newComment, [postId]: "" });
      fetchPosts();
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.response.data.message || "Failed to post comment.");
    }
  };

  const handleCommentChange = (postId, content) => {
    setNewComment({ ...newComment, [postId]: content });
  };

  const handleVote = async (postId, voteType) => {
    try {
      // Create VoteDto object according to backend structure
      const voteDto = {
        postId: postId,
        voteType: voteType, // "Upvote" or "Downvote"
        isActive: true,
      };

      await axiosInstanceCommunityPortalService.post("/posts/vote", voteDto);
      fetchPosts();
      toast.success(
        `${voteType === "Upvote" ? "Upvoted" : "Downvoted"} successfully!`
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.postId);
    setEditPost({
      postTitle: post.postTitle,
      postContent: post.postContent,
      error: "",
    });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditPost({
      postTitle: "",
      postContent: "",
      error: "",
    });
  };

  const handleUpdatePost = async (postId) => {
    if (!editPost.postTitle || !editPost.postContent) {
      setEditPost({
        ...editPost,
        error: "Both title and content are required.",
      });
      return;
    }
    try {
      const postDto = {
        postId: postId,
        patientId: currentPatientId,
        postTitle: editPost.postTitle,
        postContent: editPost.postContent,
        isActive: true,
      };

      await axiosInstanceCommunityPortalService.put("/posts/update", postDto);
      setEditingPostId(null);
      setEditPost({ postTitle: "", postContent: "", error: "" });
      fetchPosts();
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.response?.data?.message || "Failed to update post.");
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstanceCommunityPortalService.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract fileUrl from UploadFileResponseDto
      const uploadResponse = response.data;
      console.log("Upload response:", uploadResponse);

      if (uploadResponse && uploadResponse.fileUrl) {
        return uploadResponse.fileUrl;
      } else {
        throw new Error("No fileUrl in response");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleImagePaste = async (event, isEdit = false) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // Show loading toast
          const loadingToast = toast.loading("Uploading image...");

          try {
            const imageUrl = await uploadImage(file);
            const fileName = file.name || "Pasted Image";
            const markdownImage = `![${fileName}](${imageUrl})`;

            if (isEdit) {
              setEditPost((prev) => ({
                ...prev,
                postContent: `${prev.postContent}\n\n${markdownImage}`,
              }));
            } else {
              setNewPost((prev) => ({
                ...prev,
                postContent: `${prev.postContent}\n\n${markdownImage}`,
              }));
            }

            toast.dismiss(loadingToast);
            toast.success("Image uploaded and inserted successfully!");
          } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to upload image. Please try again.");
            console.error("Failed to upload image:", error);
          }
        }
      }
    }
  };

  const handleImageUpload = async (file, isEdit = false) => {
    // Show loading toast
    const loadingToast = toast.loading("Uploading image...");

    try {
      const imageUrl = await uploadImage(file);
      const fileName = file.name || "Uploaded Image";
      const markdownImage = `![${fileName}](${imageUrl})`;

      if (isEdit) {
        setEditPost((prev) => ({
          ...prev,
          postContent: `${prev.postContent}\n\n${markdownImage}`,
        }));
      } else {
        setNewPost((prev) => ({
          ...prev,
          postContent: `${prev.postContent}\n\n${markdownImage}`,
        }));
      }

      toast.dismiss(loadingToast);
      toast.success("Image uploaded and inserted successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image. Please try again.");
      console.error("Failed to upload image:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-sky-50">
      <Sidebar />

      <div className="min-w-0 flex-1 p-3 sm:p-6">
        <Navbar />
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
          {/* Header with back button */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/patient/community"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Về Dashboard
              </Link>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 text-gray-800 flex items-center justify-center gap-3">
                <FaFire className="text-orange-500" />
                HMS Community - Tất cả bài viết
              </h1>
              <p className="text-gray-600">
                Kết nối, chia sẻ và thảo luận về sức khỏe cùng cộng đồng
              </p>
            </div>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tạo bài viết mới
            </h2>
            <input
              type="text"
              placeholder="Tiêu đề bài viết"
              className={`border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                newPost.error ? "border-red-500" : "border-gray-300"
              }`}
              value={newPost.postTitle}
              onChange={(e) =>
                setNewPost({ ...newPost, postTitle: e.target.value, error: "" })
              }
            />
            {newPost.error && (
              <p className="text-red-500 text-sm mb-2">{newPost.error}</p>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor="image-upload-new"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  <FaImage className="w-4 h-4" />
                  Tải ảnh lên
                </label>
                <input
                  id="image-upload-new"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file, false);
                    }
                  }}
                  style={{ display: "none" }}
                />
                <span className="text-sm text-gray-500">
                  Hoặc dán ảnh trực tiếp (Ctrl+V)
                </span>
              </div>

              <MDEditor
                value={newPost.postContent}
                onChange={(value) =>
                  setNewPost({
                    ...newPost,
                    postContent: value || "",
                    error: "",
                  })
                }
                onPaste={(event) => handleImagePaste(event, false)}
                data-color-mode="light"
                placeholder="Chia sẻ suy nghĩ của bạn bằng Markdown..."
                hideToolbar={false}
                visibleDragBar={false}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreatePost}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPaperPlane className="w-4 h-4" />
                Đăng bài
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <div
              key={post.postId}
              className="mb-6 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 post-card"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {creatorName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="w-3 h-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit button - only show for current user's posts */}
                {currentPatientId === post.patientId && (
                  <div className="flex items-center gap-2">
                    {editingPostId === post.postId ? (
                      <>
                        <button
                          onClick={() => handleUpdatePost(post.postId)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaSave className="w-4 h-4" />
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaTimes className="w-4 h-4" />
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditPost(post)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaEdit className="w-4 h-4" />
                        Sửa
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Post Content */}
              {editingPostId === post.postId ? (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Tiêu đề bài viết"
                    className={`border p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      editPost.error ? "border-red-500" : "border-gray-300"
                    }`}
                    value={editPost.postTitle}
                    onChange={(e) =>
                      setEditPost({
                        ...editPost,
                        postTitle: e.target.value,
                        error: "",
                      })
                    }
                  />
                  {editPost.error && (
                    <p className="text-red-500 text-sm mb-2">
                      {editPost.error}
                    </p>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <label
                        htmlFor="image-upload-edit"
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2"
                      >
                        <FaImage className="w-4 h-4" />
                        Tải ảnh lên
                      </label>
                      <input
                        id="image-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file, true);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <span className="text-sm text-gray-500">
                        Hoặc dán ảnh trực tiếp (Ctrl+V)
                      </span>
                    </div>

                    <MDEditor
                      value={editPost.postContent}
                      onChange={(value) =>
                        setEditPost({
                          ...editPost,
                          postContent: value || "",
                          error: "",
                        })
                      }
                      onPaste={(event) => handleImagePaste(event, true)}
                      data-color-mode="light"
                      placeholder="Chỉnh sửa nội dung bài viết bằng Markdown..."
                      hideToolbar={false}
                      visibleDragBar={false}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-3 text-gray-900">
                    {post.postTitle}
                  </h2>
                  <div
                    className="mb-4 text-gray-700 leading-relaxed"
                    style={{ backgroundColor: "white", color: "#374151" }}
                  >
                    <MarkdownRenderer
                      content={post.postContent}
                      className="post-content"
                    />
                  </div>
                </>
              )}

              {/* Post Actions */}
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaComment className="w-4 h-4" />
                    <span>{post.comments?.length || 0} bình luận</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>
                      Điểm:{" "}
                      {(post.upVoteCount || 0) - (post.downVoteCount || 0)}
                    </span>
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(post.postId, "Upvote")}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 vote-button"
                  >
                    <FaThumbsUp className="w-4 h-4" />
                    {post.upVoteCount || 0}
                  </button>
                  <button
                    onClick={() => handleVote(post.postId, "Downvote")}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 vote-button"
                  >
                    <FaThumbsDown className="w-4 h-4" />
                    {post.downVoteCount || 0}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaComment className="w-4 h-4" />
                  Bình luận ({post.comments?.length || 0})
                </h4>

                {post.comments.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.commentId}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        {/* Comment Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            {comment.patientAvatar ? (
                              <img
                                src={comment.patientAvatar}
                                alt={comment.patientName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <FaUser className="text-white w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 text-sm">
                              {comment.patientName}
                            </h5>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FaClock className="w-3 h-3" />
                              <span>
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Comment Content */}
                        <div className="text-sm text-gray-700 ml-11">
                          {comment.commentContent}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4 italic">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Thêm bình luận..."
                    className={`border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 comment-input ${
                      newComment.error ? "border-red-500" : ""
                    }`}
                    value={newComment[post.postId] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.postId, e.target.value)
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCreateComment(post.postId);
                      }
                    }}
                  />
                  {newComment.error && (
                    <p className="text-red-500 text-sm">{newComment.error}</p>
                  )}
                  <button
                    onClick={() => handleCreateComment(post.postId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 vote-button"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                    Bình luận
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HMSCommunityFull;
