import IssueForm from "../components/IssueForm";

const ReportIssue = () => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto py-4">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-3">
          Report a Civic Issue
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Help us improve the community by providing details below.
        </p>
      </div>
      <IssueForm />
    </div>
  );
};

export default ReportIssue;
