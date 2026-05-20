import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
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
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { setFormErrors } from "@/lib/api/errors";

const emailVerificationSchema = z.object({
  code: z.string().min(6, "Verification code must be at least 6 characters"),
});

const resendEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
type ResendEmailFormData = z.infer<typeof resendEmailSchema>;

export const EmailVerificationForm = () => {
  const [searchParams] = useSearchParams();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const {
    confirmEmail,
    resendConfirmationCode,
    isConfirmEmailLoading,
    isResendConfirmationLoading,
  } = useAuth();

  const userId = searchParams.get("userId") || searchParams.get("id");
  const code = searchParams.get("code");
  const email = searchParams.get("email");

  const form = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: code || "",
    },
  });

  const resendForm = useForm<ResendEmailFormData>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit = (data: EmailVerificationFormData) => {
    if (!userId) {
      form.setError("root", { message: "Invalid verification link" });
      return;
    }

    form.clearErrors();
    confirmEmail(
      {
        userId: userId,
        code: data.code,
      },
      {
        onError: (error) => {
          setFormErrors(error, form.setError);
        },
      }
    );
  };

  // Auto-submit if both userId and code are provided in URL
  useEffect(() => {
    if (userId && code && code.length >= 6) {
      form.setValue("code", code);
      // Use setTimeout to ensure form state is updated
      setTimeout(() => {
        form.handleSubmit(onSubmit)();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, code]);

  const handleResendCode = () => {
    // If email is in URL params, use it directly
    if (email) {
      resendConfirmationCode({ email });
      return;
    }

    // Otherwise, show email input form
    setShowEmailInput(true);
  };

  const handleResendSubmit = (data: ResendEmailFormData) => {
    resendConfirmationCode(
      { email: data.email },
      {
        onSuccess: () => {
          setShowEmailInput(false);
          resendForm.reset({ email: data.email });
        },
      }
    );
  };

  if (!userId) {
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--purple)]/10">
            <Mail className="h-6 w-6 text-[var(--purple)]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We've sent you a verification email. Please check your inbox and click the verification link to activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <Link to="/login" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-base font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>
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
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          {email ? (
            <>
              We've sent a verification code to <strong>{email}</strong>
            </>
          ) : code ? (
            "Please verify your email address"
          ) : (
            "Enter the verification code sent to your email"
          )}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="pr-10 text-center text-2xl tracking-widest"
                      {...field}
                    />
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
            disabled={isConfirmEmailLoading}
          >
            {isConfirmEmailLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </Form>

      {/* Resend Code */}
      <div className="text-center space-y-4">
        {!showEmailInput ? (
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-[var(--purple)] font-semibold"
              onClick={handleResendCode}
              disabled={isResendConfirmationLoading}
            >
              {isResendConfirmationLoading ? "Sending..." : "Resend Code"}
            </Button>
          </p>
        ) : (
          <form
            onSubmit={resendForm.handleSubmit(handleResendSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email Address</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="Enter your email address"
                {...resendForm.register("email")}
                disabled={isResendConfirmationLoading}
              />
              {resendForm.formState.errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {resendForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isResendConfirmationLoading}
                className="flex-1 bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                {isResendConfirmationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Code
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEmailInput(false);
                  resendForm.reset({ email: email || "" });
                }}
                disabled={isResendConfirmationLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--purple)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
