import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import {
  CATEGORY_LABELS,
  getArticleExcerpt,
} from "../../utils/articleUtils";
import "../../styles/doctor-articles.css";

const FILTER_CATEGORIES = [
  { value: "", label: "All Categories" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const PatientArticlesPage = () => {
  const fetchedRef = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanceCommunityPortalService.get(
        "/articles/all"
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      await fetchArticles();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstanceCommunityPortalService.get(
        `/articles/search?keyword=${encodeURIComponent(searchKeyword.trim())}`
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    try {
      setLoading(true);
      const response = category
        ? await axiosInstanceCommunityPortalService.get(
            `/articles/category/${category}`
          )
        : await axiosInstanceCommunityPortalService.get("/articles/all");
      setArticles(response.data);
    } catch (error) {
      console.error("Error filtering articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
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
              <h1>Medical Articles</h1>
              <p>Read Markdown articles and interact directly with doctors</p>
            </div>
            <div className="header-actions">
              <Link to="/patient/articles/bookmarks" className="btn-white-articles">
                <BookmarkBorderIcon fontSize="small" /> Saved
              </Link>
            </div>
          </div>

          <div className="articles-toolbar">
            <input
              type="text"
              className="articles-search-input"
              placeholder="Search articles..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="btn-primary-articles" onClick={handleSearch}>
              <SearchIcon fontSize="small" /> Search
            </button>
            <select
              className="articles-category-filter"
              value={selectedCategory}
              onChange={(event) => handleCategoryFilter(event.target.value)}
            >
              {FILTER_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="articles-loading">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="articles-empty">
              <div className="empty-icon">A</div>
              <h3>No articles found</h3>
              <p>Try another keyword or choose a different category</p>
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

export default PatientArticlesPage;
