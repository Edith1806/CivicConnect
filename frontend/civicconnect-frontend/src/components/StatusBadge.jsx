const statusStyles = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${statusStyles[status] || "bg-slate-200 text-slate-700"}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
