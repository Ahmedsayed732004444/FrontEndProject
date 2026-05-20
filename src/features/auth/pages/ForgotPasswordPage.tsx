import React from "react";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
