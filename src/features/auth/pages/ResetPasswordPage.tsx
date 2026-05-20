import React from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
