import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  isLoading?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

/**
 * Shared authentication card component with consistent styling and layout
 * Provides a reusable card layout for all auth pages with optional back button and submit functionality
 */
export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  showBackButton = false,
  backButtonText = "Back",
  backButtonHref = "/",
  isLoading = false,
  onSubmit,
  submitButtonText = "Submit",
  showSubmitButton = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        {showBackButton && (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to={backButtonHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backButtonText}
              </Link>
            </Button>
          </div>
        )}

        {/* Main Auth Card */}
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-4">
              {children}

              {/* Submit Button */}
              {showSubmitButton && (
                <Button
                  type="submit"
                  className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {submitButtonText}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * Auth Form Field component for consistent field styling and error handling
 */
interface AuthFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const AuthFormField: React.FC<AuthFormFieldProps> = ({
  label,
  error,
  required = false,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-card-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Auth Success Message component for displaying success states
 */
interface AuthSuccessMessageProps {
  title: string;
  description?: string;
  action?: {
    text: string;
    href: string;
  };
}

export const AuthSuccessMessage: React.FC<AuthSuccessMessageProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-success-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button
          asChild
          className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
        >
          <Link to={action.href}>{action.text}</Link>
        </Button>
      )}
    </div>
  );
};
