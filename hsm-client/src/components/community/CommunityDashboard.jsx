import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axiosInstanceCommunityPortalService from "../../utils/axiosInstanceCommunityPortalService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/PatientSidebar";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaUser,
  FaClock,
  FaTrophy,
  FaCalendarAlt,
  FaArrowRight,
  FaMedal,
  FaStar,
  FaChartLine,
  FaPen,
  FaLayerGroup,
  FaRegNewspaper,
  FaUsers,
  FaRegClock,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/community-dashboard.css";

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [topDailyPosts, setTopDailyPosts] = useState([]);
  const [topMonthlyPosts, setTopMonthlyPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [creatorName, setCreatorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCreatorName(controller.signal),
          fetchPosts(controller.signal),
        ]);
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const fetchCreatorName = async (signal) => {
    try {
      const response = await axiosInstancePatientService.get("/profile", {
        signal,
      });
      setCreatorName(`${response.data.firstName} ${response.data.lastName}`);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching creator's name:", error);
      }
    }
  };

  const fetchPosts = async (signal) => {
    try {
      const response = await axiosInstanceCommunityPortalService.get("/posts", {
        signal,
      });
      const postsWithVotesPromises = response.data.map(async (post) => {
        try {
          const [voteCountResponse, commentsResponse] = await Promise.all([
            axiosInstanceCommunityPortalService.get(
              `/posts/${post.postId}/votes/count`,
              { signal }
            ),
            axiosInstanceCommunityPortalService.get(
              `/posts/${post.postId}/comments`,
              { signal }
            ),
          ]);

          return {
            ...post,
            comments: commentsResponse.data,
            upVoteCount: voteCountResponse.data.upVoteCount,
            downVoteCount: voteCountResponse.data.downVoteCount,
            score:
              voteCountResponse.data.upVoteCount -
              voteCountResponse.data.downVoteCount,
          };
        } catch (error) {
          if (error.name === "CanceledError") throw error;
          console.error(`Error fetching data for post ${post.postId}:`, error);
          return {
            ...post,
            comments: [],
            upVoteCount: 0,
            downVoteCount: 0,
            score: 0,
          };
        }
      });

      const postsWithVotes = await Promise.all(postsWithVotesPromises);
      setPosts(postsWithVotes);
      processPostsForCategories(postsWithVotes);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching posts:", error);
      }
    }
  };

  const processPostsForCategories = (allPosts) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyPosts = allPosts.filter(
      (post) => new Date(post.createdAt) >= today
    );
    const monthlyPosts = allPosts.filter(
      (post) => new Date(post.createdAt) >= thisMonth
    );

    setTopDailyPosts(
      [...dailyPosts].sort((a, b) => b.score - a.score).slice(0, 5)
    );
    setTopMonthlyPosts(
      [...monthlyPosts].sort((a, b) => b.score - a.score).slice(0, 5)
    );
    setLatestPosts(
      [...allPosts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    );
  };

  const handleVote = async (postId, voteType) => {
    try {
      await axiosInstanceCommunityPortalService.post("/posts/vote", {
        postId,
        voteType,
        isActive: true,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  /* ── Stats data ── */
  const totalComments = posts.reduce(
    (sum, p) => sum + (p.comments?.length || 0),
    0
  );
  const stats = [
    {
      label: "Tổng bài viết",
      value: posts.length,
      icon: FaRegNewspaper,
      gradient: "cd-stat--posts",
    },
    {
      label: "Hôm nay",
      value: topDailyPosts.length,
      icon: FaCalendarAlt,
      gradient: "cd-stat--today",
    },
    {
      label: "Bình luận",
      value: totalComments,
      icon: FaComment,
      gradient: "cd-stat--comments",
    },
    {
      label: "Thành viên",
      value: new Set(posts.map((p) => p.creatorId)).size || 0,
      icon: FaUsers,
      gradient: "cd-stat--members",
    },
  ];

  /* ── Rank config ── */
  const rankConfig = [
    { icon: FaTrophy, cls: "cd-rank--gold" },
    { icon: FaMedal, cls: "cd-rank--silver" },
    { icon: FaStar, cls: "cd-rank--bronze" },
  ];

  /* ── PostCard component ── */
  const PostCard = ({ post, index, showRank = false }) => (
    <div
      className={`cd-post-card ${showRank && index < 3 ? rankConfig[index]?.cls : ""}`}
      onClick={() => navigate(`/patient/community/post/${post.postId}`)}
    >
      {/* Rank indicator */}
      {showRank && index < 3 && (
        <div className="cd-post-card__rank">
          {(() => {
            const RankIcon = rankConfig[index].icon;
            return <RankIcon />;
          })()}
          <span>#{index + 1}</span>
        </div>
      )}

      {/* Content area */}
      <div className="cd-post-card__body">
        <h4 className="cd-post-card__title">{post.postTitle}</h4>
        <p className="cd-post-card__excerpt">
          {truncateContent(post.postContent)}
        </p>

        {/* Meta row */}
        <div className="cd-post-card__meta">
          <div className="cd-post-card__author">
            <div className="cd-post-card__avatar">
              <FaUser />
            </div>
            <span>{creatorName || "Thành viên"}</span>
          </div>
          <div className="cd-post-card__time">
            <FaRegClock />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="cd-post-card__actions">
        <div className="cd-post-card__stats-row">
          <span className="cd-post-card__stat">
            <FaComment /> {post.comments?.length || 0}
          </span>
          {showRank && (
            <span className="cd-post-card__stat cd-post-card__stat--score">
              <FaChartLine /> {post.score}
            </span>
          )}
        </div>
        <div className="cd-post-card__votes">
          <button
            className="cd-vote cd-vote--up"
            onClick={(e) => {
              e.stopPropagation();
              handleVote(post.postId, "Upvote");
            }}
          >
            <FaThumbsUp /> {post.upVoteCount || 0}
          </button>
          <button
            className="cd-vote cd-vote--down"
            onClick={(e) => {
              e.stopPropagation();
              handleVote(post.postId, "Downvote");
            }}
          >
            <FaThumbsDown /> {post.downVoteCount || 0}
          </button>
        </div>
      </div>
    </div>
  );

  PostCard.propTypes = {
    post: PropTypes.shape({
      postId: PropTypes.string.isRequired,
      postTitle: PropTypes.string.isRequired,
      postContent: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      score: PropTypes.number,
      upVoteCount: PropTypes.number,
      downVoteCount: PropTypes.number,
      comments: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    index: PropTypes.number,
    showRank: PropTypes.bool,
  };

  /* ── Empty state ── */
  const EmptyState = ({ message }) => (
    <div className="cd-empty">
      <div className="cd-empty__icon">
        <FaLayerGroup />
      </div>
      <p className="cd-empty__text">{message}</p>
      <Link to="/patient/community/create" className="cd-empty__cta">
        <FaPen /> Viết bài đầu tiên
      </Link>
    </div>
  );

  EmptyState.propTypes = {
    message: PropTypes.string.isRequired,
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-sky-50">
        <Sidebar />
        <div className="min-w-0 flex-1 p-3 sm:p-6">
          <Navbar />
          <div className="cd-loading">
            <div className="cd-loading__spinner" />
            <p className="cd-loading__text">Đang tải cộng đồng...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="flex min-h-screen bg-sky-50">
      <Sidebar />
      <div className="min-w-0 flex-1 p-3 sm:p-6">
        <Navbar />

        <div className="cd-wrapper">
          {/* ─── Hero banner ─── */}
          <section className="cd-hero">
            <div className="cd-hero__decor cd-hero__decor--1" />
            <div className="cd-hero__decor cd-hero__decor--2" />
            <div className="cd-hero__decor cd-hero__decor--3" />

            <div className="cd-hero__content">
              <p className="cd-hero__label">Community</p>
              <h1 className="cd-hero__title">
                Cộng đồng HMS
              </h1>
              <p className="cd-hero__subtitle">
                Chia sẻ kinh nghiệm, thảo luận và kết nối với cộng đồng sức
                khỏe HMS
              </p>
              <div className="cd-hero__actions">
                <Link to="/patient/community/create" className="cd-btn cd-btn--primary">
                  <FaPen /> Viết bài mới
                </Link>
                <Link to="/patient/community/all" className="cd-btn cd-btn--ghost">
                  <FaLayerGroup /> Tất cả bài viết
                </Link>
              </div>
            </div>
          </section>

          {/* ─── Stats row ─── */}
          <section className="cd-stats">
            {stats.map((s) => (
              <div key={s.label} className={`cd-stat ${s.gradient}`}>
                <div className="cd-stat__icon">
                  <s.icon />
                </div>
                <div className="cd-stat__info">
                  <span className="cd-stat__value">{s.value}</span>
                  <span className="cd-stat__label">{s.label}</span>
                </div>
              </div>
            ))}
          </section>

          {/* ─── Main content grid ─── */}
          <div className="cd-grid">
            {/* Left column – Top posts */}
            <section className="cd-section">
              <div className="cd-section__header">
                <div className="cd-section__title-group">
                  <FaTrophy className="cd-section__icon cd-section__icon--gold" />
                  <h2 className="cd-section__title">Bài viết nổi bật</h2>
                </div>

                <div className="cd-tabs">
                  <button
                    className={`cd-tab ${activeTab === "daily" ? "cd-tab--active" : ""}`}
                    onClick={() => setActiveTab("daily")}
                  >
                    <FaCalendarAlt /> Hôm nay
                  </button>
                  <button
                    className={`cd-tab ${activeTab === "monthly" ? "cd-tab--active" : ""}`}
                    onClick={() => setActiveTab("monthly")}
                  >
                    <FaChartLine /> Tháng này
                  </button>
                </div>
              </div>

              <div className="cd-post-list">
                {activeTab === "daily" &&
                  (topDailyPosts.length > 0 ? (
                    topDailyPosts.map((post, i) => (
                      <PostCard
                        key={post.postId}
                        post={post}
                        index={i}
                        showRank
                      />
                    ))
                  ) : (
                    <EmptyState message="Chưa có bài viết nổi bật hôm nay" />
                  ))}

                {activeTab === "monthly" &&
                  (topMonthlyPosts.length > 0 ? (
                    topMonthlyPosts.map((post, i) => (
                      <PostCard
                        key={post.postId}
                        post={post}
                        index={i}
                        showRank
                      />
                    ))
                  ) : (
                    <EmptyState message="Chưa có bài viết nổi bật tháng này" />
                  ))}
              </div>
            </section>

            {/* Right column – Latest posts */}
            <section className="cd-section">
              <div className="cd-section__header">
                <div className="cd-section__title-group">
                  <FaClock className="cd-section__icon cd-section__icon--green" />
                  <h2 className="cd-section__title">Mới nhất</h2>
                </div>
                <Link to="/patient/community/all" className="cd-section__link">
                  Xem tất cả <FaChevronRight />
                </Link>
              </div>

              <div className="cd-post-list">
                {latestPosts.length > 0 ? (
                  latestPosts.map((post, i) => (
                    <PostCard key={post.postId} post={post} index={i} />
                  ))
                ) : (
                  <EmptyState message="Chưa có bài viết nào" />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
