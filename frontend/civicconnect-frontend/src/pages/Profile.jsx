import { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../api/Profile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleEditClick = () => {
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updatedUser = await updateProfile(editForm);
      setUser(updatedUser);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-pulse">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback safely if user data is missing
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white dark:bg-darkcard rounded-3xl shadow-glass text-slate-500">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in-up">
      
      {/* Header section with cover photo */}
      <div className="bg-white dark:bg-darkcard rounded-3xl shadow-glass dark:shadow-glass-dark border border-slate-200 dark:border-white/5 overflow-hidden relative">
        
        {/* Abstract Cover Gradient */}
        <div className="h-48 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-2xl mix-blend-overlay pointer-events-none"></div>
        </div>

        {/* Profile Content Container */}
        <div className="px-8 pb-10 relative">
          
          {/* Avatar & Action Button - negative margin to overlap cover */}
          <div className="flex justify-between items-end -mt-16 mb-6">
            <div className="p-2 bg-white dark:bg-darkcard rounded-full inline-block relative border border-slate-100 dark:border-white/10 shadow-xl">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-100 to-brand-300 dark:from-brand-600 dark:to-brand-800 flex items-center justify-center text-brand-700 dark:text-white text-5xl font-display font-extrabold shadow-inner border border-white/50 dark:border-white/10 relative overflow-hidden">
                <span className="relative z-10">{user.name ? user.name.charAt(0).toUpperCase() : "?"}</span>
                <div className="absolute inset-0 bg-white/20 select-none"></div>
              </div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-darkcard rounded-full"></div>
            </div>

            <button 
              onClick={handleEditClick}
              className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl font-semibold transition-all mb-2 flex items-center gap-2"
            >
              <span>✏️</span> Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-10">
            {/* Left Col: Main Info */}
            <div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-brand-600 dark:text-brand-400 font-medium uppercase tracking-wider text-sm mt-1">
                {user.role}
              </p>
              
              <div className="mt-8 space-y-6">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">Contact Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5 text-slate-500">
                      📧
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                      <p className="text-slate-900 dark:text-white font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5 text-slate-500">
                      📱
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Phone Number</p>
                      {user.phone ? (
                        <p className="text-slate-900 dark:text-white font-medium">{user.phone}</p>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-500 italic">Not provided</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5 text-slate-500">
                      📍
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Home Address</p>
                      {user.address ? (
                        <p className="text-slate-900 dark:text-white font-medium leading-tight mt-0.5">{user.address}</p>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-500 italic">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Stats / Activities (UI ONLY to look realistic) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-white/5 h-fit relative overflow-hidden">
               {/* Decorative background slice */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl"></div>

               <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-6">Activity Snapshot</h3>
               
               <div className="space-y-5 relative z-10">
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-600 dark:text-slate-400 text-sm">Issues Reported</span>
                     <span className="font-bold text-slate-900 dark:text-white">12</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-500 w-3/4 rounded-full"></div>
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-slate-600 dark:text-slate-400 text-sm">Issues Resolved</span>
                     <span className="font-bold text-slate-900 dark:text-white">8</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-2/3 rounded-full"></div>
                   </div>
                 </div>
                 
                 <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
                   <p className="text-xs text-center text-slate-500">Account Active Since <br/> <span className="font-semibold text-slate-700 dark:text-slate-300">Jan 2026</span></p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mb-6">
              Update Profile
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</label>
                <textarea
                  rows="3"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
