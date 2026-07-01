import { useEffect, useState } from "react";
import IssueCard from "../components/IssueCard";
import { fetchMyIssues } from "../api/issues";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues()
      .then(setIssues)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          My Issues
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track the progress of issues you reported
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your issues...</p>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-medium">
            No issues reported yet
          </p>
          <p className="mt-2">
            Start by reporting your first civic issue.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </>
  );
};

export default MyIssues;
