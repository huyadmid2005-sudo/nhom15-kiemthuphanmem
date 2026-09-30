import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/PatientSidebar";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import { toast } from "react-toastify";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaUser,
  FaPaperPlane,
  FaClock,
  FaArrowLeft,
  FaEye,
  FaShare,
} from "react-icons/fa";
import "../../styles/community.css";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCreatorName(), fetchPost()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCreatorName = async () => {
    try {
      const response = await axiosInstancePatientService.get("/profile");
      setCreatorName(`${response.data.firstName} ${response.data.lastName}`);
    } catch (error) {
      console.error("Error fetching creator's name:", error);
    }
  };

  const fetchPost = async () => {
    try {
      // Fetch post details
      const postResponse = await axiosInstanceCommunityPortalService.get(
        `/posts/${postId}`
      );

      // Fetch vote counts
      const voteCountResponse = await axiosInstanceCommunityPortalService.get(
        `/posts/${postId}/votes/count`
      );

      // Fetch comments
      const commentsResponse = await axiosInstanceCommunityPortalService.get(
        `/posts/${postId}/comments`
      );

      const postData = {
        ...postResponse.data,
        upVoteCount: voteCountResponse.data.upVoteCount,
        downVoteCount: voteCountResponse.data.downVoteCount,
        score:
          voteCountResponse.data.upVoteCount -
          voteCountResponse.data.downVoteCount,
      };

      setPost(postData);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Không thể tải bài viết");
      navigate("/patient/community");
    }
  };

  const handleVote = async (voteType) => {
    try {
      const voteDto = {
        postId: parseInt(postId),
        voteType: voteType,
        isActive: true,
      };

      await axiosInstanceCommunityPortalService.post("/posts/vote", voteDto);
      await fetchPost(); // Refresh post data
      toast.success(
        `${voteType === "Upvote" ? "Upvoted" : "Downvoted"} successfully!`
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      toast.error("Bình luận không được để trống");
      return;
    }

    try {
      await axiosInstanceCommunityPortalService.post("/comments/create", {
        postId: parseInt(postId),
        commentContent: newComment,
      });
      setNewComment("");
      await fetchPost(); // Refresh comments
      toast.success("Bình luận đã được thêm!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
      } else {
        return date.toLocaleDateString("vi-VN");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-sky-50">
        <Sidebar />
        <div className="min-w-0 flex-1 p-3 sm:p-6">
          <Navbar />
          <div className="container mx-auto p-4 bg-white min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen bg-sky-50">
        <Sidebar />
        <div className="min-w-0 flex-1 p-3 sm:p-6">
          <Navbar />
          <div className="container mx-auto p-4 bg-white min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Không tìm thấy bài viết
              </h2>
              <Link
                to="/patient/community"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Quay lại Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-sky-50">
      <Sidebar />
      <div className="min-w-0 flex-1 p-3 sm:p-6">
        <Navbar />
        <div className="container mx-auto p-4 bg-white min-h-screen">
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
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <FaEye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 200) + 100} lượt xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaShare className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-8">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {creatorName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Score: {post.score}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              {post.postTitle}
            </h1>

            {/* Post Content */}
            <div className="mb-6 text-gray-700 leading-relaxed prose max-w-none">
              <MarkdownRenderer content={post.postContent} />
            </div>

            {/* Post Actions */}
            <div className="flex justify-between items-center border-t pt-6">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaComment className="w-4 h-4" />
                  <span>{comments.length} bình luận</span>
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote("Upvote")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaThumbsUp className="w-4 h-4" />
                  {post.upVoteCount || 0}
                </button>
                <button
                  onClick={() => handleVote("Downvote")}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaThumbsDown className="w-4 h-4" />
                  {post.downVoteCount || 0}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FaComment className="w-6 h-6 text-blue-500" />
              Bình luận ({comments.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleCreateComment();
                  }
                }}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  Nhấn Ctrl+Enter để đăng
                </span>
                <button
                  onClick={handleCreateComment}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaPaperPlane className="w-4 h-4" />
                  Đăng bình luận
                </button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaUser className="text-white w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {creatorName}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FaClock className="w-3 h-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-700 ml-13">
                      {comment.commentContent}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaComment className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
