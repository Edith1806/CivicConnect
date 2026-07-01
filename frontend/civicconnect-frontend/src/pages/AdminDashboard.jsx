import { useEffect, useState } from "react";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AdminDashboard = () => {

  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {

      const [issuesRes, statsRes] = await Promise.all([
        api.get("/issues"),
        api.get("/issues/stats")
      ]);

      setIssues(issuesRes.data);
      setStats(statsRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/issues/${id}/status?status=${status}`);
      fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIssue = async (id) => {

    if (!window.confirm("Delete this issue?")) return;

    try {
      await api.delete(`/issues/${id}`);
      setIssues(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const batchUpdate = async (status) => {

    try {

      await Promise.all(
        selectedIds.map(id =>
          api.put(`/issues/${id}/status?status=${status}`)
        )
      );

      setSelectedIds([]);
      fetchIssues();

    } catch (err) {
      console.error(err);
    }
  };

  const batchDelete = async () => {

    if (!window.confirm("Delete selected issues?")) return;

    try {

      await Promise.all(
        selectedIds.map(id =>
          api.delete(`/issues/${id}`)
        )
      );

      setSelectedIds([]);
      fetchIssues();

    } catch (err) {
      console.error(err);
    }
  };

  const filteredIssues = issues
    .filter(i =>
      filter === "ALL" ? true : i.status === filter
    )
    .filter(i =>
      priorityFilter === "ALL"
        ? true
        : i.priority === priorityFilter
    )
    .filter(i =>
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase())
    );

  const pieData = [
    { name: "Open", value: stats?.open || 0 },
    { name: "In Progress", value: stats?.inProgress || 0 },
    { name: "Resolved", value: stats?.resolved || 0 },
    { name: "Closed", value: stats?.closed || 0 }
  ];

  const priorityData = [
    {
      name: "High",
      value: issues.filter(i => i.priority === "HIGH").length
    },
    {
      name: "Medium",
      value: issues.filter(i => i.priority === "MEDIUM").length
    },
    {
      name: "Low",
      value: issues.filter(i => i.priority === "LOW").length
    }
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#94a3b8"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-slate-50 dark:bg-darkbg min-h-screen text-slate-900 dark:text-slate-100">

      {/* Header */}

      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
        Admin Dashboard
      </h1>

      <p className="text-gray-500 dark:text-slate-400 mb-10">
        Manage and track all issues across your organization
      </p>

      {/* Stats Cards */}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">

          {[
            { label: "Total Issues", value: stats.total, color:"from-blue-500 to-blue-600"},
            { label: "Open", value: stats.open, color:"from-red-500 to-red-600"},
            { label: "In Progress", value: stats.inProgress, color:"from-purple-500 to-purple-600"},
            { label: "Resolved", value: stats.resolved, color:"from-green-500 to-green-600"},
            { label: "Closed", value: stats.closed, color:"from-gray-500 to-gray-600"}
          ].map(card => (

            <div
              key={card.label}
              className={`p-6 rounded-xl text-white shadow-lg bg-gradient-to-r ${card.color} hover:scale-[1.03] hover:shadow-glow-sm transition-all duration-300`}
            >
              <p className="text-sm opacity-90">{card.label}</p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>

          ))}

        </div>
      )}

      {/* Charts */}

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-lg border border-slate-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-brand-500/5 transition">

          <h3 className="font-semibold mb-4 text-slate-800 dark:text-white">
            Issues by Status
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-lg border border-slate-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-brand-500/5 transition">

          <h3 className="font-semibold mb-4 text-slate-800 dark:text-white">
            Priority Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={priorityData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip />

              <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Search Panel */}

      <div className="bg-white dark:bg-darkcard p-5 rounded-xl shadow-lg border border-slate-100 dark:border-white/5 mb-8 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search by category or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg flex-1 bg-slate-50 dark:bg-darksurf text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
        />

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-darksurf text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

      </div>

      {/* Status Filters */}

      <div className="flex gap-3 mb-6 flex-wrap">

        {["ALL","OPEN","IN_PROGRESS","RESOLVED","CLOSED"].map(status => (

          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                filter === status
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-brand-500/25"
                  : "bg-white dark:bg-darkcard border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
          >
            {status}
          </button>

        ))}

      </div>

      {/* Select Controls */}

      <div className="flex gap-4 mb-4">

        <button
          onClick={() =>
            setSelectedIds(filteredIssues.map(i => i.id))
          }
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
        >
          Select All
        </button>

        <button
          onClick={() => setSelectedIds([])}
          className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium"
        >
          Deselect All
        </button>

      </div>

      {/* Batch Panel */}

      {selectedIds.length > 0 && (

        <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-white/5 rounded-xl mb-6">

          <span className="font-medium text-slate-700 dark:text-slate-300 self-center">
            {selectedIds.length} selected
          </span>

          <button
            onClick={() => batchUpdate("IN_PROGRESS")}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition"
          >
            Move to In Progress
          </button>

          <button
            onClick={() => batchUpdate("RESOLVED")}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
          >
            Resolve
          </button>

          <button
            onClick={() => batchUpdate("CLOSED")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            Close
          </button>

          <button
            onClick={batchDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
          >
            Delete
          </button>

        </div>
      )}

      {/* Issue List */}

      {loading ? (

        <p className="text-slate-500">Loading issues...</p>

      ) : filteredIssues.length === 0 ? (

        <p className="text-slate-500">No issues found.</p>

      ) : (

        <div className="space-y-6">

          {filteredIssues.map(issue => (

            <div
              key={issue.id}
              className="bg-white dark:bg-darkcard rounded-xl shadow-md border border-slate-100 dark:border-white/5 p-6 hover:shadow-xl transition"
            >

              <div className="flex items-start gap-4">

                <input
                  type="checkbox"
                  checked={selectedIds.includes(issue.id)}
                  onChange={(e) => {

                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, issue.id]);
                    } else {
                      setSelectedIds(
                        selectedIds.filter(id => id !== issue.id)
                      );
                    }

                  }}
                  className="mt-2 w-5 h-5 accent-brand-500"
                />

                <div className="flex-1">

                  <IssueCard issue={issue} />

                </div>

              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                {issue.status === "OPEN" && (
                  <button
                    onClick={() =>
                      updateStatus(issue.id,"IN_PROGRESS")
                    }
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition"
                  >
                    Mark In Progress
                  </button>
                )}

                {issue.status === "IN_PROGRESS" && (
                  <button
                    onClick={() =>
                      updateStatus(issue.id,"RESOLVED")
                    }
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
                  >
                    Mark Resolved
                  </button>
                )}

                {issue.status === "RESOLVED" && (
                  <button
                    onClick={() =>
                      updateStatus(issue.id,"CLOSED")
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
                  >
                    Close Issue
                  </button>
                )}

                <button
                  onClick={() => deleteIssue(issue.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;