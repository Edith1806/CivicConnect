import { useEffect, useState } from "react";
import IssueCard from "../components/IssueCard";
import { fetchCommunityIssues } from "../api/issues";

const CommunityIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(10); // default 10km
  const [searchQuery, setSearchQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState("detecting"); // detecting, captured, denied, error
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    // 📍 Fetch user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus("captured");
        },
        (error) => {
          console.warn("Geolocation access denied or failed:", error);
          setLocationStatus("denied");
          // Fetch issues without coordinates (will return all/latest)
          loadIssues(null, null, null);
        }
      );
    } else {
      setLocationStatus("error");
      loadIssues(null, null, null);
    }
  }, []);

  // Reload issues when coordinates or radius changes
  useEffect(() => {
    if (coords) {
      loadIssues(coords.latitude, coords.longitude, radius);
    }
  }, [coords, radius]);

  const loadIssues = (lat, lng, rad) => {
    setLoading(true);
    fetchCommunityIssues(lat, lng, rad)
      .then((data) => {
        setIssues(data);
      })
      .catch((err) => {
        console.error("Failed to load community issues", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleManualRefresh = () => {
    if (coords) {
      loadIssues(coords.latitude, coords.longitude, radius);
    } else {
      loadIssues(null, null, null);
    }
  };

  // Filter issues locally by search query and status filter
  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      issue.description?.toLowerCase().includes(query) ||
      issue.location?.toLowerCase().includes(query) ||
      issue.category?.toLowerCase().includes(query);
      
    const matchesStatus = statusFilter === "ALL" ? true : issue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Community Issues
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            See what other citizens have reported around you. Upvote to support their resolution.
          </p>
        </div>

        {/* Location Status Badge */}
        <div className="flex items-center">
          {locationStatus === "detecting" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Detecting Location...
            </span>
          )}
          {locationStatus === "captured" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Proximity Search Active ({radius}km radius)
            </span>
          )}
          {locationStatus === "denied" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              <span>⚠️</span>
              Location blocked. Showing all reports.
            </span>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 p-4 bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 rounded-2xl shadow-glass dark:shadow-glass-dark space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search by landmark, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          </div>

          <div className="w-full md:w-auto flex items-center gap-4 justify-between md:justify-end">
            {coords && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Radius:
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>
            )}

            <button
              onClick={handleManualRefresh}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all text-slate-700 dark:text-slate-300 font-semibold"
              title="Refresh feed"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Status Tabs Filter */}
        <div className="flex gap-2 border-t border-slate-100 dark:border-white/5 pt-4 overflow-x-auto">
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                ${
                  statusFilter === status
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5"
                }
              `}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Scanning local neighborhood reports...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-glass dark:shadow-glass-dark">
          <svg className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white">
            No community reports found
          </p>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
            {searchQuery
              ? "We couldn't find any issues matching your search query. Try typing something else."
              : locationStatus === "captured"
              ? `There are no issues reported by other citizens within a ${radius}km radius. Try expanding the search radius.`
              : "No issues reported by other citizens yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} isCommunityView={true} onVoteChange={handleManualRefresh} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityIssues;
