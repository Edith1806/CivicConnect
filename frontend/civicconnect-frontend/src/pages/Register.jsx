import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // Phone validation
  const phonePattern = /^[6-9]\d{9}$/;

  if (!phonePattern.test(form.phone)) {
    setError("Please enter a valid 10-digit phone number.");
    return;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(form.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  // Password validation
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordPattern.test(form.password)) {
    setError(
      "Password must be at least 8 characters and include uppercase, lowercase, and a number."
    );
    return;
  }

  setLoading(true);

  try {
    await api.post("/citizens/register", form);

    setSuccess(
      "Registration successful! Please check your email to verify your account."
    );

    setTimeout(() => navigate("/login"), 1500);

  } catch (err) {
    setError(
      err.response?.data?.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join CivicConnect and make your city better"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
            {success}
          </div>
        )}

        <InputField label="Full Name" name="name" onChange={handleChange} required />
        <InputField label="Phone" name="phone" type="tel" onChange={handleChange} required />
        <InputField label="Address" name="address" onChange={handleChange} required />
        <InputField label="Email" name="email" type="email" onChange={handleChange} required />
        <InputField label="Password" name="password" type="password" onChange={handleChange} required />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-lg
            bg-brand-600 text-white font-semibold
            hover:bg-brand-700 transition
            disabled:opacity-60
          "
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
