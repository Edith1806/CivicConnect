import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyCallback from "./pages/VerifyCallback";

import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";
import CommunityIssues from "./pages/CommunityIssues";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import IssueDetails from "./pages/IssueDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

import AdminRoute from "./routes/AdminRoute";
function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-callback" element={<VerifyCallback />} />

      {/* Dashboard layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="report-issue" element={<ReportIssue />} />
        <Route path="issues" element={<MyIssues />} />
        <Route path="community" element={<CommunityIssues />} />
        <Route path="profile" element={<Profile />} />
      </Route>
<Route
  path="/issues/:id"
  element={
    <ProtectedRoute>
      <IssueDetails />
    </ProtectedRoute>
  }
/>
 {/* <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>*/} 
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRole="ROLE_ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;
