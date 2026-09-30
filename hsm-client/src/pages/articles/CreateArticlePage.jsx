import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoctorSidebar from "../../components/sidebar/DoctorSidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import {
  CATEGORIES,
  THUMBNAIL_URL_PATTERN,
} from "../../utils/articleUtils";
import "../../styles/markdown-editor.css";
import "../../styles/doctor-articles.css";

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "GENERAL_HEALTH",
    thumbnailUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((previous) => ({ ...previous, content: value || "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();
    const trimmedThumbnailUrl = formData.thumbnailUrl.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a title");
      return;
    }

    if (!trimmedContent) {
      toast.error("Please enter the article content in Markdown");
      return;
    }

    if (
      trimmedThumbnailUrl &&
      !THUMBNAIL_URL_PATTERN.test(trimmedThumbnailUrl)
    ) {
      toast.error("Thumbnail must be a valid http(s) URL or data:image value");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstanceCommunityPortalService.post("/articles/create", {
        title: trimmedTitle,
        content: trimmedContent,
        category: formData.category,
        thumbnailUrl: trimmedThumbnailUrl || null,
      });
      toast.success("Article created successfully");
      navigate("/doctor/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create article"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <DoctorSidebar />
      <div className="flex-grow">
        <Navbar />
        <div className="articles-page">
          <div className="page-header">
            <div>
              <h1>Create New Article</h1>
              <p>Write your article in Markdown for rich detail-page rendering</p>
            </div>
            <button
              className="btn-white-articles"
              onClick={() => navigate("/doctor/articles")}
            >
              <ArrowBackIcon fontSize="small" /> Back
            </button>
          </div>

          <div className="article-form">
            <form onSubmit={handleSubmit} className="form-card">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFieldChange}
                  className="form-input"
                  placeholder="Enter the article title..."
                  maxLength={250}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFieldChange}
                  className="form-select"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail (URL or data:image, optional)</label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleFieldChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg or data:image/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Markdown Content *</label>
                <p className="form-help-text">
                  Supports headings, lists, bold text, links, images, and code blocks.
                </p>
                <div data-color-mode="light" className="markdown-editor-wrapper">
                  <MDEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    preview="edit"
                    height={420}
                    visibleDragBar={false}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-white-articles btn-secondary-articles"
                  onClick={() => navigate("/doctor/articles")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-articles"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticlePage;
