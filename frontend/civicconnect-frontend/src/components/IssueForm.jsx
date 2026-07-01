import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const IssueForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    category: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    priority: "MEDIUM",
    images: [],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    
    // Revoke previous URLs to avoid memory leaks
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const updatedImages = form.images.filter((_, idx) => idx !== index);
    const updatedPreviews = imagePreviews.filter((_, idx) => idx !== index);
    
    // Revoke the URL of the removed preview
    URL.revokeObjectURL(imagePreviews[index]);
    
    setForm({ ...form, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => setError("Location access denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION (must be here)
    if (!form.category) {
      setError("Please select an issue category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      const issueData = {
        category: form.category,
        description: form.description,
        location: form.location,
        latitude: form.latitude,
        longitude: form.longitude,
        priority: form.priority,
      };

      // backend expects "data"
      formData.append(
        "data",
        new Blob([JSON.stringify(issueData)], {
          type: "application/json",
        })
      );

      // images
      form.images.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Issue reported successfully!");
      navigate("/dashboard/issues");

    } catch (err) {
      console.error(err);
      setError("❌ Failed to submit issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 p-6 sm:p-10 rounded-3xl shadow-glass dark:shadow-glass-dark relative overflow-hidden"
    >
      {/* Decorative Blur Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        {/* Category Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-900 dark:text-white appearance-none h-[58px]"
            >
              <option value="" disabled>Select Issue Type</option>
              <option value="ROAD">Road</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="GARBAGE">Garbage</option>
              <option value="DRAINAGE">Drainage</option>
              <option value="STREET_LIGHT">Street Light</option>
              <option value="OTHER">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>
        </div>

        {/* Priority Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Priority Level</label>
          <div className="relative">
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-900 dark:text-white appearance-none h-[58px]"
            >
              <option value="LOW">Low - Not Urgent</option>
              <option value="MEDIUM">Medium - Normal Attention</option>
              <option value="HIGH">High - Urgent Action</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-2 relative z-10">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Description <span className="text-red-500">*</span></label>
        <textarea
          name="description"
          placeholder="Please describe the details of the issue..."
          rows="4"
          className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
          onChange={handleChange}
          required
        />
      </div>

      {/* Location Field */}
      <div className="space-y-2 relative z-10">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Landmark / Area <span className="text-red-500">*</span></label>
        <input
          name="location"
          placeholder="E.g., Central Park near the fountain"
          className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          onChange={handleChange}
          required
        />
      </div>

      {/* GeoLocation Feature */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Precise Geolocation</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Help authorities locate the exact issue coordinate.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={fetchLocation}
            className="px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm font-semibold transition-all text-slate-700 dark:text-slate-200 hover:text-brand-600 flex gap-2 items-center whitespace-nowrap"
          >
            <span>📍</span> Auto-Detect
          </button>

          {form.latitude && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Captured
            </span>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 relative z-10">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Upload Images (Optional)</label>
        <div className="p-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/30 dark:file:text-brand-300 file:cursor-pointer cursor-pointer transition-all file:transition-all"
          />
        </div>
        
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-white/10 shadow-sm bg-slate-50 dark:bg-slate-900">
                <img src={src} alt={`Upload preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 relative z-10">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-600 text-white text-lg font-bold rounded-xl hover:bg-brand-500 hover:-translate-y-1 shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Issue</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;
