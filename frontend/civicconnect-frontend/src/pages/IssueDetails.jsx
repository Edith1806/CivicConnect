import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import ImageCarouselModal from "../components/ImageCarouselModal";
import { fetchIssueTimeline } from "../api/timeline";

const BASE_URL = "http://localhost:8080";

// ─── helpers ──────────────────────────────────────────────────────────────────

const getStatusBadge = (status) => {
  switch (status) {
    case "OPEN":         return "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-700/50";
    case "IN_PROGRESS":  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50";
    case "RESOLVED":     return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50";
    case "CLOSED":       return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    default:             return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
  }
};

const timelineConfig = {
  CREATED: {
    icon: "📋",
    color: "bg-emerald-500",
    ring: "ring-emerald-200 dark:ring-emerald-800/50",
    label: "Issue Filed",
    textColor: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    border: "border-emerald-100 dark:border-emerald-900/30",
  },
  STATUS_CHANGE: {
    icon: "🔄",
    color: "bg-brand-500",
    ring: "ring-brand-200 dark:ring-brand-800/50",
    label: "Status Updated",
    textColor: "text-brand-700 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-900/10",
    border: "border-brand-100 dark:border-brand-900/30",
  },
  REMARK_ADDED: {
    icon: "💬",
    color: "bg-blue-500",
    ring: "ring-blue-200 dark:ring-blue-800/50",
    label: "Admin Note",
    textColor: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-100 dark:border-blue-900/30",
  },
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1)  return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24)  return `${diffHrs}h ago`;
  if (diffDays < 7)  return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ─── component ────────────────────────────────────────────────────────────────

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [issue, setIssue]         = useState(null);
  const [timeline, setTimeline]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [remarkInput, setRemarkInput] = useState("");
  const [submittingRemark, setSubmittingRemark] = useState(false);

  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    if (!remarkInput.trim()) return;
    setSubmittingRemark(true);
    try {
      const res = await api.put(`/issues/${id}/remark?remark=${encodeURIComponent(remarkInput)}`);
      setIssue(res.data);
      const events = await fetchIssueTimeline(id);
      setTimeline(events);
      setRemarkInput("");
    } catch (err) {
      console.error("Failed to submit remark", err);
      alert("Failed to submit remark");
    } finally {
      setSubmittingRemark(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        const fetchedIssue = res.data;
        setIssue(fetchedIssue);

        // Always fetch timeline (works for both USER and ADMIN)
        if (fetchedIssue) {
          const events = await fetchIssueTimeline(id);
          setTimeline(events);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );

  if (!issue) return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h2 className="text-2xl font-display font-bold text-slate-700 mb-2">Issue Not Found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg">
        Go Back
      </button>
    </div>
  );

  const images = issue.imageUrls?.map((img) => `${BASE_URL}${img}`) || [];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in-up">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium"
      >
        <span>&larr;</span> Back to Issues
      </button>

      <div className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-white/5 shadow-glass dark:shadow-glass-dark overflow-hidden relative">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Image Gallery */}
        {images.length > 0 && (
          <div
            className="w-full h-80 sm:h-96 relative group cursor-pointer overflow-hidden border-b border-slate-200 dark:border-white/5"
            onClick={() => setCarouselOpen(true)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg">
                View Gallery
              </span>
            </div>
            <img
              src={images[0]}
              alt="Issue"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                +{images.length - 1} more
              </div>
            )}
          </div>
        )}

        <div className="p-8 sm:p-10 relative z-20">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-4 py-1 text-xs font-bold uppercase rounded-full ${getStatusBadge(issue.status)}`}>
                  {issue.status.replace("_", " ")}
                </span>
                <span className="text-xs font-semibold text-slate-400">ID: #{issue.id}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-2 capitalize">
                {issue.category}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Reported by <span className="font-medium text-slate-600 dark:text-slate-300">{issue.citizenName || "Unknown"}</span>
                {" · "}{formatRelativeTime(issue.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
              <span>👍</span>
              <span>{issue.upvoteCount || 0} community upvotes</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{issue.description}</p>
          </div>

          {/* Location */}
          <div className="mt-8 flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-xl">📍</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{issue.location}</span>
          </div>

          {/* Map */}
          {issue.latitude && issue.longitude && (
            <div className="mt-8 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <iframe
                title="map"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}&z=15&output=embed`}
                className="filter dark:contrast-125"
              />
            </div>
          )}

          {/* ─── PROGRESS TIMELINE ──────────────────────────────────────── */}
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold mb-2 text-slate-900 dark:text-white flex items-center gap-2">
              <span>📡</span> Resolution Timeline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              A full history of activity on this issue
            </p>

            {timeline.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                <span className="text-3xl mb-2 block">⏳</span>
                <p className="text-sm font-medium">No activity recorded yet</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[22px] top-5 bottom-5 w-0.5 bg-slate-200 dark:bg-white/10 rounded-full" />

                <AnimatePresence>
                  {timeline.map((event, idx) => {
                    const cfg = timelineConfig[event.eventType] || timelineConfig.CREATED;
                    const isLast = idx === timeline.length - 1;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="relative flex gap-5 mb-6 last:mb-0"
                      >
                        {/* Node dot */}
                        <div className={`
                          relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                          text-lg ring-4 ${cfg.ring} shadow-sm
                          ${isLast ? cfg.color : "bg-white dark:bg-darkcard border-2 border-slate-200 dark:border-white/10"}
                        `}>
                          {isLast
                            ? <span className="text-white">{cfg.icon}</span>
                            : <span>{cfg.icon}</span>
                          }
                        </div>

                        {/* Content card */}
                        <div className={`flex-1 rounded-2xl border p-4 sm:p-5 ${cfg.bg} ${cfg.border}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.textColor}`}>
                              {cfg.label}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span title={formatDateTime(event.timestamp)}>
                                {formatRelativeTime(event.timestamp)}
                              </span>
                              <span>·</span>
                              <span>{formatDateTime(event.timestamp)}</span>
                            </div>
                          </div>

                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                            {event.description}
                          </p>

                          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                            <span>👤</span>
                            <span>{event.performedBy}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Admin remark edit card */}
          {role === "ROLE_ADMIN" && (
            <form onSubmit={handleRemarkSubmit} className="mt-8 p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Add Resolution Remark
              </label>
              <textarea
                rows="3"
                placeholder="Type administrator note or remark..."
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-darkcard border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white resize-none"
              />
              <button
                type="submit"
                disabled={submittingRemark || !remarkInput.trim()}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
              >
                {submittingRemark ? "Submitting..." : "Submit Note"}
              </button>
            </form>
          )}

          {/* Admin remark banner (if exists) */}
          {issue.adminRemark && (
            <div className="mt-8 flex gap-4 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
              <span className="text-2xl flex-shrink-0">💬</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
                  Latest Admin Remark
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {issue.adminRemark}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Carousel */}
      {carouselOpen && (
        <ImageCarouselModal
          images={images}
          startIndex={0}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </div>
  );
};

export default IssueDetails;
