// src/app/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import PublicLayout from "@/shared/components/navigation/PublicLayout";
import AppLayout from "@/shared/components/navigation/AppLayout";
import ScrollToTop from "@/shared/components/navigation/ScrollToTop";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import HomePage from "@/features/home/pages/HomePage";
import NotFoundPage from "@/shared/components/NotFoundPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ConfirmEmailPage from "@/features/auth/pages/ConfirmEmailPage";
import OAuthCallbackPage from "@/features/auth/pages/OAuthCallbackPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import EditProfilePage from "@/features/profile/pages/EditProfilePage";
import JobsListPage from "@/features/jobs/pages/JobsListPage";
import JobDetailsPage from "@/features/jobs/pages/JobDetailsPage";
import JobTrackerPage from "@/features/job-tracker/pages/JobTrackerPage";
import CompanyDashboard from "@/features/company/pages/CompanyDashboard";
import JobApplicantsPage from "@/features/company/pages/JobApplicantsPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import RoadmapsPage from "@/features/roadmaps/pages/RoadmapsPage";
import RoadmapDetailsPage from "@/features/roadmaps/pages/RoadmapDetailsPage";
import AiPage from "@/features/ai/pages/AiPage";
import InterviewPage from "@/features/interview/pages/InterviewPage";
import PostsPage from "@/features/posts/pages/PostsPage";
import MyPostsPage from "@/features/posts/pages/MyPostsPage";
import HelpPage from "@/shared/components/HelpPage";
import FollowersPage from "@/features/follow/pages/FollowersPage";
import FollowingPage from "@/features/follow/pages/FollowingPage";
import MyFollowersPage from "@/features/follow/pages/MyFollowersPage";
import MyFollowingPage from "@/features/follow/pages/MyFollowingPage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";

const MainRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={isAuthenticated ? <Navigate to="/profile" replace /> : <HomePage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/my/followers" element={<MyFollowersPage />} />
          <Route path="/profile/my/following" element={<MyFollowingPage />} />
          <Route path="/profile/:userId/followers" element={<FollowersPage />} />
          <Route path="/profile/:userId/following" element={<FollowingPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/interview/:jobId" element={<InterviewPage />} />
          <Route path="/job-tracker" element={<JobTrackerPage />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/jobs/:jobId/applicants" element={<JobApplicantsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/roadmaps" element={<RoadmapsPage />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetailsPage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/my" element={<MyPostsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>

        <Route path="*" element={<PublicLayout />}>
          <Route index element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" replace /> : <AuthLayout variant="login"><LoginPage /></AuthLayout>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" replace /> : <AuthLayout variant="register"><RegisterPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout variant="forgot"><ForgotPasswordPage /></AuthLayout>} />
        <Route path="/auth/forgetPassword" element={<AuthLayout variant="reset"><ResetPasswordPage /></AuthLayout>} />
        <Route path="/resetPassword" element={<AuthLayout variant="reset"><ResetPasswordPage /></AuthLayout>} />
        <Route path="/emailConfirmation" element={<AuthLayout variant="verify"><VerifyEmailPage /></AuthLayout>} />
        <Route path="/auth/emailConfirmation" element={<AuthLayout variant="verify"><ConfirmEmailPage /></AuthLayout>} />
        <Route path="/confirm-email" element={<AuthLayout variant="verify"><ConfirmEmailPage /></AuthLayout>} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      </Routes>
    </>
  );
};

export default MainRouter;
