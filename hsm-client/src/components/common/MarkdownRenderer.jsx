import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import PropTypes from "prop-types";
import "../../styles/markdown-editor.css";

const MarkdownRenderer = ({ content, className = "" }) => {
  return (
    <div className={`markdown-renderer ${className}`} data-color-mode="light">
      <MDEditor.Markdown
        source={content || ""}
        style={{
          backgroundColor: "white",
          color: "#374151",
          padding: 0,
          border: "none",
        }}
      />
    </div>
  );
};

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

export default MarkdownRenderer;
