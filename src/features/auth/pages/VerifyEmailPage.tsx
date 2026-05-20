import React from "react";
import { EmailVerificationForm } from "@/features/auth/components/EmailVerificationForm";

const VerifyEmail: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <EmailVerificationForm />
    </div>
  );
};

export default VerifyEmail;
