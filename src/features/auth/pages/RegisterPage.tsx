import React from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
};

export default Register;
