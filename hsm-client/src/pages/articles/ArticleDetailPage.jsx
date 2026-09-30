import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import Navbar from "../../components/navbar/Navbar";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import {
  CATEGORY_LABELS,
  getActorTypeLabel,
} from "../../utils/articleUtils";
import "../../styles/doctor-articles.css";

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const currentRole = localStorage.getItem("role");
  const isDoctor = currentRole === "Doctor";
  const Sidebar = isDoctor ? DoctorSidebar : PatientSidebar;
  const listPath = isDoctor ? "/doctor/articles" : "/patient/articles";

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchArticleData();
  }, [articleId]);

  const fetchArticleData = async () => {
    try {
      setLoading(true);
      const [articleResponse, commentsResponse] = await Promise.all([
        axiosInstanceCommunityPortalService.get(`/articles/${articleId}`),
        axiosInstanceCommunityPortalService.get(`/articles/${articleId}/comments`),
      ]);

      setArticle(articleResponse.data);
      setLiked(Boolean(articleResponse.data.likedByCurrentUser));
      setLikeCount(articleResponse.data.likeCount || 0);
      setBookmarked(Boolean(articleResponse.data.bookmarkedByCurrentUser));
      setComments(commentsResponse.data || []);
    } catch (error) {
      console.error("Error fetching article detail:", error);
      toast.error("Article not found");
      navigate(listPath);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await axiosInstanceCommunityPortalService.post(
        `/articles/like/${articleId}`
      );
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(error.response?.data?.message || "Unable to update the like");
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const response = await axiosInstanceCommunityPortalService.post(
        `/articles/bookmark/${articleId}`
      );
      setBookmarked(response.data.bookmarked);
      toast.success(
        response.data.bookmarked ? "Article saved" : "Bookmark removed"
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error(error.response?.data?.message || "Unable to save this article");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await axiosInstanceCommunityPortalService.post(
        "/articles/comment",
        {
          articleId: Number(articleId),
          content: newComment.trim(),
        }
      );
      setComments((previous) => [response.data, ...previous]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit the comment"
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstanceCommunityPortalService.delete(
        `/articles/comment/${commentId}`
      );
      setComments((previous) =>
        previous.filter((comment) => comment.commentId !== commentId)
      );
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(
        error.response?.data?.message || "Unable to delete this comment"
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentActorInfo = () => {
    if (isDoctor) {
      return {
        actorId: article?.doctorId || localStorage.getItem("doctorId"),
        actorType: "DOCTOR",
      };
    }

    return {
      actorId: localStorage.getItem("patientId"),
      actorType: "PATIENT",
    };
  };

  const canDeleteComment = (comment) => {
    const currentActor = getCurrentActorInfo();
    if (!currentActor.actorId) return false;
    return (
      comment.actorId === currentActor.actorId &&
      comment.actorType === currentActor.actorType
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Navbar />
          <div className="articles-page">
            <div className="articles-loading">
              <div className="spinner"></div>
              <p>Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="articles-page">
          <div className="detail-toolbar">
            <button
              className="btn-primary-articles"
              onClick={() => navigate(listPath)}
            >
              <ArrowBackIcon fontSize="small" /> Back
            </button>

            {isDoctor && (
              <button
                className="btn-white-articles detail-edit-button"
                onClick={() => navigate(`/doctor/articles/edit/${article.articleId}`)}
              >
                <EditIcon fontSize="small" /> Edit
              </button>
            )}
          </div>

          <div className="article-detail">
            <div className="detail-header">
              <span className={`card-category category-${article.category}`}>
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
              <h1 className="detail-title">{article.title}</h1>
              <div className="detail-meta">
                <span>{article.doctorName || "Doctor"}</span>
                {article.doctorDepartment && (
                  <span>{article.doctorDepartment}</span>
                )}
                <span>{formatDate(article.createdAt)}</span>
              </div>
            </div>

            {article.thumbnailUrl && (
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="detail-thumbnail"
              />
            )}

            <div className="detail-content article-markdown-content">
              <MarkdownRenderer content={article.content} />
            </div>

            <div className="detail-interactions">
              <button
                className={`detail-interaction-btn ${liked ? "active-like" : ""}`}
                onClick={handleToggleLike}
              >
                {liked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
                {likeCount} Like
              </button>

              <button
                className={`detail-interaction-btn ${
                  bookmarked ? "active-bookmark" : ""
                }`}
                onClick={handleToggleBookmark}
              >
                {bookmarked ? (
                  <BookmarkIcon fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
                {bookmarked ? "Saved" : "Save"}
              </button>
            </div>

            <div className="comments-section">
              <h3>Comments ({comments.length})</h3>

              <div className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Write a comment..."
                  maxLength={2000}
                />
                <button
                  className="btn-primary-articles"
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  style={{ alignSelf: "flex-end" }}
                >
                  <SendIcon fontSize="small" />
                </button>
              </div>

              {comments.length === 0 ? (
                <p className="comments-empty-text">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author-block">
                        <span className="comment-author">
                          {comment.actorName || "User"}
                        </span>
                        <span className="comment-role">
                          {getActorTypeLabel(comment.actorType)}
                        </span>
                      </div>

                      <div className="comment-actions">
                        <span className="comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="comment-delete-btn"
                            title="Delete comment"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
