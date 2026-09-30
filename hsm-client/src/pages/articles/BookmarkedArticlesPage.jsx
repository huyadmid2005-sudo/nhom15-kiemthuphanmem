import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import {
  CATEGORY_LABELS,
  getArticleExcerpt,
} from "../../utils/articleUtils";
import "../../styles/doctor-articles.css";

const BookmarkedArticlesPage = () => {
  const navigate = useNavigate();
  const fetchedRef = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceCommunityPortalService.get(
        "/articles/bookmarks/my"
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
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

  const getDoctorInitials = (name) => {
    if (!name) return "BS";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-sky-50">
      <PatientSidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="articles-page">
          <div className="page-header">
            <div>
              <h1>Saved Articles</h1>
              <p>Reopen the Markdown articles you want to read later</p>
            </div>
            <button
              className="btn-white-articles"
              onClick={() => navigate("/patient/articles")}
            >
              <ArrowBackIcon fontSize="small" /> Back
            </button>
          </div>

          {loading ? (
            <div className="articles-loading">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="articles-empty">
              <div className="empty-icon">S</div>
              <h3>No saved articles yet</h3>
              <p>Open an article and click bookmark to save it</p>
              <Link
                to="/patient/articles"
                className="btn-primary-articles"
                style={{ marginTop: "16px", display: "inline-flex" }}
              >
                Browse Articles
              </Link>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <Link
                  key={article.articleId}
                  to={`/patient/articles/${article.articleId}`}
                  className="article-card-link"
                >
                  <div className="article-card">
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
                        <div className="card-doctor">
                          <div className="card-doctor-avatar">
                            {getDoctorInitials(article.doctorName)}
                          </div>
                          <div className="card-doctor-info">
                            <span className="card-doctor-name">
                              {article.doctorName || "Doctor"}
                            </span>
                            <span className="card-doctor-dept">
                              {article.doctorDepartment || ""}
                            </span>
                          </div>
                        </div>
                        <span className="card-date">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkedArticlesPage;
