import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import axiosInstanceDoctorService from "../../utils/axiosInstanceDoctorService";
import {
  CATEGORY_LABELS,
  getArticleExcerpt,
} from "../../utils/articleUtils";
import "../../styles/doctor-articles.css";

const DoctorArticlesPage = () => {
  const navigate = useNavigate();
  const fetchedRef = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const doctorResponse = await axiosInstanceDoctorService.get("/profile");
      const articlesResponse = await axiosInstanceCommunityPortalService.get(
        `/articles/doctor/${doctorResponse.data.doctorId}`
      );
      setArticles(articlesResponse.data);
    } catch (error) {
      console.error("Error fetching doctor articles:", error);
      toast.error("Unable to load your articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      await axiosInstanceCommunityPortalService.delete(`/articles/${articleId}`);
      setArticles((previous) =>
        previous.filter((article) => article.articleId !== articleId)
      );
      toast.success("Article deleted");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openDetail = (articleId) => {
    navigate(`/doctor/articles/${articleId}`);
  };

  return (
    <div className="flex">
      <DoctorSidebar />
      <div className="flex-grow">
        <Navbar />
        <div className="articles-page">
          <div className="page-header">
            <div>
              <h1>My Articles</h1>
              <p>Manage articles, open details, and track engagement</p>
            </div>
            <div className="header-actions">
              <Link to="/doctor/articles/create" className="btn-white-articles">
                <AddIcon fontSize="small" /> Create Article
              </Link>
            </div>
          </div>

          <div className="articles-stats">
            <div className="stat-card-article">
              <div className="stat-value">{articles.length}</div>
              <div className="stat-label">Total Articles</div>
            </div>
            <div className="stat-card-article">
              <div className="stat-value">
                {articles.reduce(
                  (total, article) => total + (article.likeCount || 0),
                  0
                )}
              </div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="stat-card-article">
              <div className="stat-value">
                {articles.reduce(
                  (total, article) => total + (article.commentCount || 0),
                  0
                )}
              </div>
              <div className="stat-label">Total Comments</div>
            </div>
          </div>

          {loading ? (
            <div className="articles-loading">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="articles-empty">
              <div className="empty-icon">A</div>
              <h3>No articles yet</h3>
              <p>Start writing in Markdown to share content with patients</p>
              <Link
                to="/doctor/articles/create"
                className="btn-primary-articles"
                style={{ marginTop: "16px", display: "inline-flex" }}
              >
                <AddIcon fontSize="small" /> Create Your First Article
              </Link>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <div
                  key={article.articleId}
                  className="article-card article-card-clickable"
                  onClick={() => openDetail(article.articleId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(article.articleId);
                    }
                  }}
                >
                  {article.thumbnailUrl ? (
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      className="card-thumbnail"
                    />
                  ) : (
                    <div className="card-thumbnail-placeholder">
                      <ArticleIcon style={{ fontSize: "3rem" }} />
                    </div>
                  )}

                  <div className="card-body">
                    <span className={`card-category category-${article.category}`}>
                      {CATEGORY_LABELS[article.category] || article.category}
                    </span>
                    <div className="card-title">{article.title}</div>
                    <div className="card-excerpt">
                      {getArticleExcerpt(article.content)}
                    </div>

                    <div className="card-interactions">
                      <span className="interaction-item">
                        <FavoriteIcon fontSize="small" /> {article.likeCount || 0}
                      </span>
                      <span className="interaction-item">
                        <ChatBubbleOutlineIcon fontSize="small" />{" "}
                        {article.commentCount || 0}
                      </span>
                    </div>

                    <div className="card-footer">
                      <span className="card-date">
                        {formatDate(article.createdAt)}
                      </span>
                      <div className="card-actions">
                        <button
                          className="btn-edit-articles"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/doctor/articles/edit/${article.articleId}`);
                          }}
                          title="Edit article"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          className="btn-danger-articles"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(article.articleId);
                          }}
                          title="Delete article"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorArticlesPage;
