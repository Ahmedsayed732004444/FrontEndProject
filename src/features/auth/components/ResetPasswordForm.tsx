import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { resetPasswordSchema } from "@/features/auth/schemas/authSchemas";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EyeIcon, EyeOffIcon, Lock, ArrowLeft } from "lucide-react";
import { setFormErrors } from "@/lib/api/errors";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { resetPassword, isResetPasswordLoading } = useAuth();

  // Support both old (id, token) and new (userId, code) query params
  const email = searchParams.get("email");
  const code = searchParams.get("code") || searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        email: email || "",   // prefilled from URL
        code: code || "",     // prefilled from URL
        newPassword: "",
      },
    });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email || !code) {
      form.setError("root", { message: "Invalid reset link" });
      return;
    }

    form.clearErrors();
    resetPassword(
      {
        email: email || "",
        code: code || "",
        newPassword: data.newPassword,
      },
      {
        onError: (error) => {
          setFormErrors(error, form.setError);
        },
      }
    );
  };

  if (!email || !code) {
    return (
      <div className="w-full space-y-6">
        {/* Logo and Header */}
        <div className="flex items-center gap-2 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--purple)]">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-foreground">Career Path</span>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-destructive">Invalid Link</h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link to="/forgot-password" className="block">
          <Button className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90 h-11 text-base font-semibold">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Logo and Header */}
      <div className="flex items-center gap-2 justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--purple)]">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-foreground">Career Path</span>
      </div>
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Create new password
        </h1>
        <p className="text-muted-foreground">
          Enter your new password below to secure your account.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className="pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90 h-11 text-base font-semibold"
            disabled={isResetPasswordLoading}
          >
            {isResetPasswordLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--purple)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
};
