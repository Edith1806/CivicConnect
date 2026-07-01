import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarouselModal from "./ImageCarouselModal";
import { upvoteIssue, downvoteIssue } from "../api/issues";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:8080";

const getCategoryColor = (category) => {
  switch(category) {
    case "POTHOLE": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50";
    case "STREETLIGHT": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
    case "GARBAGE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
    case "WATER_LEAK": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700/50";
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'OPEN':
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    case 'IN_PROGRESS':
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50";
    case 'RESOLVED':
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
  }
};

const IssueCard = ({ issue, isCommunityView, onVoteChange }) => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [upvoted, setUpvoted] = useState(issue.upvotedByCurrentUser || false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvoteCount || 0);
  const [voting, setVoting] = useState(false);
  const navigate = useNavigate();

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (voting) return;
    setVoting(true);

    try {
      if (upvoted) {
        await downvoteIssue(issue.id);
        setUpvoted(false);
        setUpvoteCount((prev) => Math.max(0, prev - 1));
      } else {
        await upvoteIssue(issue.id);
        setUpvoted(true);
        setUpvoteCount((prev) => prev + 1);
      }
      if (onVoteChange) onVoteChange();
    } catch (err) {
      console.error("Upvote action failed", err);
    } finally {
      setVoting(false);
    }
  };

  const images = issue.imageUrls?.map((img) => `${BASE_URL}${img}`) || [];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="group relative flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkcard shadow-glass dark:shadow-glass-dark hover:shadow-card-hover cursor-pointer overflow-hidden transition-all duration-300"
    >
      {/* Decorative gradient blur on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-violet-500/0 rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${getCategoryColor(issue.category)}`}>
            {issue.category.replace('_', ' ')}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${getStatusBadge(issue.status)}`}>
            {issue.status.replace('_', ' ')}
          </span>
        </div>

        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
          {issue.description}
        </h3>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {issue.priority === 'HIGH' && (
             <span className="px-2 py-1 text-[10px] font-bold text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800/50">
               🚨 HIGH PRIORITY
             </span>
          )}
          {!issue.statusViewed && !isCommunityView && (
            <span className="px-2 py-1 text-[10px] font-bold text-brand-700 bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 rounded-md border border-brand-200 dark:border-brand-800/50">
              ✨ NEW UPDATE
            </span>
          )}
        </div>

        {images.length > 0 && (
          <div className="relative h-40 mt-2 mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 group/img">
            <img 
              src={images[0]} 
              alt="Issue preview" 
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                +{images.length - 1} MORE
              </div>
            )}
            {/* View gallery overlay */}
            <div 
              className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setCarouselOpen(true);
              }}
            >
              <span className="text-white text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-full border border-white/30">View Gallery</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 max-w-[60%] truncate">
            <span className="text-brand-500">📍</span> {issue.location}
          </p>

          {isCommunityView ? (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={handleUpvote}
              disabled={voting}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${
                  upvoted
                    ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/25 scale-105 border border-brand-500/50"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-transparent dark:border-white/5"
                }
              `}
            >
              <motion.span 
                animate={upvoted ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                👍
              </motion.span>
              <span>{upvoteCount} Upvotes</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-50 dark:bg-white/5 rounded-md border border-slate-100 dark:border-white/5">
              <span>👍</span>
              <span>{upvoteCount}</span>
            </div>
          )}
        </div>
      </div>

      {carouselOpen && (
        <ImageCarouselModal
          images={images}
          startIndex={startIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default IssueCard;
