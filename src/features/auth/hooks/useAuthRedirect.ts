// src/features/auth/hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};
