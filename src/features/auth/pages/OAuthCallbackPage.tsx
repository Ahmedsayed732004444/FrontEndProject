import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { Loader2 } from "lucide-react";

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const expiresIn = searchParams.get("expiresIn");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");

    if (token && refreshToken && expiresIn && userId && email) {
      // Parse expiresIn to number
      const expiresInNumber = parseInt(expiresIn, 10);

      // Create user object
      const user = {
        id: userId,
        email: email,
        firstName: firstName || "",
        lastName: lastName || "",
      };

      // Save data using the auth context login method
      login(user, token, refreshToken, expiresInNumber);

      // Redirect to home page
      navigate("/", { replace: true });
    } else {
      // If any required param is missing, redirect to login
      console.error("Missing required OAuth parameters");
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Completing sign in...</h1>
        <p className="text-muted-foreground">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
