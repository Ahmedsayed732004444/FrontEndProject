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
    const refreshTokenExpiration = searchParams.get("refreshTokenExpiration"); // ✅ زود

    if (token && refreshToken && expiresIn && userId && email) {
      const expiresInNumber = parseInt(expiresIn, 10);

      const user = {
        id: userId,
        email: email,
        firstName: firstName || "",
        lastName: lastName || "",
      };

      login(user, token, refreshToken, expiresInNumber, refreshTokenExpiration || undefined); // ✅ زود

      navigate("/profile", { replace: true }); // ✅ صح
    } else {
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