import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyCallback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    api
      .get("/auth/verify", {
        params: { token },
      })
      .then(() => {
        setStatus("success");
        setMessage("Email verified successfully!");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Verification failed or link expired.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl p-8 text-center shadow-lg">
        {status === "loading" && (
          <p className="text-lg font-medium">Verifying your account...</p>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">
              Verification Successful 🎉
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Your account is now active. You can login.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Verification Failed ❌
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyCallback;
