// src/lib/api/errors.ts
import axios, { AxiosError } from "axios";
import type { Path, UseFormSetError } from "react-hook-form";

export interface ValidationError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]> | string[];
  traceId?: string;
}

export const isValidationError = (error: unknown): error is AxiosError<ValidationError> => {
  return axios.isAxiosError(error) && error.response?.data !== undefined && typeof error.response.data === "object" && "errors" in error.response.data && "status" in error.response.data && "title" in error.response.data;
};

const isErrorCode = (str: string): boolean => {
  if (!str || typeof str !== "string") return false;
  if (str.includes(".")) return true;
  const isPascalCase = /^[A-Z][a-zA-Z]*$/.test(str);
  const isShort = str.length < 30;
  if (isPascalCase && isShort) {
    const lowerStr = str.toLowerCase();
    const hasMessageWords = lowerStr.includes("invalid") || lowerStr.includes("already") || lowerStr.includes("taken") || lowerStr.includes("required") || lowerStr.includes("must") || lowerStr.includes("should");
    return !hasMessageWords;
  }
  return false;
};

const getDefaultErrorMessage = (errorCode: string): string => {
  const code = errorCode.includes(".") ? errorCode.split(".").pop() : errorCode;
  const defaultMessages: Record<string, string> = {
    DuplicateUserName: "This username is already taken",
    DuplicateEmail: "This email is already registered",
    InvalidEmail: "Please enter a valid email address",
    InvalidPassword: "Invalid password",
    PasswordTooShort: "Password is too short",
    PasswordRequiresDigit: "Password must contain at least one digit",
    PasswordRequiresLower: "Password must contain at least one lowercase letter",
    PasswordRequiresUpper: "Password must contain at least one uppercase letter",
    PasswordRequiresNonAlphanumeric: "Password must contain at least one special character",
    InvalidLogin: "Invalid email or username",
    InvalidCredentials: "Invalid email/password",
    UserNotFound: "User not found",
    EmailNotConfirmed: "Email not confirmed",
    InvalidToken: "Invalid token",
    ExpiredToken: "Token has expired",
    InvalidCode: "Invalid verification code",
  };
  return defaultMessages[code ?? ""] || errorCode;
};

const mapErrorCodeToField = (errorCode: string): string | null => {
  const code = errorCode.includes(".") ? errorCode.split(".").pop() : errorCode;
  const errorCodeMap: Record<string, string> = {
    DuplicateUserName: "userName",
    DuplicateEmail: "email",
    InvalidEmail: "email",
    InvalidPassword: "password",
    PasswordTooShort: "password",
    PasswordRequiresDigit: "password",
    PasswordRequiresLower: "password",
    PasswordRequiresUpper: "password",
    PasswordRequiresNonAlphanumeric: "password",
    InvalidLogin: "emailOrUsername",
    InvalidCredentials: "emailOrUsername",
    UserNotFound: "email",
    EmailNotConfirmed: "email",
    InvalidToken: "code",
    ExpiredToken: "code",
    InvalidCode: "code",
  };
  return errorCodeMap[code ?? ""] || null;
};

export const extractErrorMessage = (error: unknown): string => {
  if (isValidationError(error)) {
    const validationError = error.response?.data;
    if (validationError?.errors) {
      if (Array.isArray(validationError.errors)) {
        const descriptiveError = validationError.errors.find((err) => typeof err === "string" && err.length > 1 && !isErrorCode(err));
        if (descriptiveError) return descriptiveError;
        const meaningfulError = validationError.errors.find((err) => typeof err === "string" && err.length > 1);
        if (meaningfulError) {
          if (isErrorCode(meaningfulError)) return getDefaultErrorMessage(meaningfulError);
          return meaningfulError;
        }
        if (validationError.title && validationError.title.length > 1) return validationError.title;
      } else if (typeof validationError.errors === "object") {
        for (const errorKey of Object.keys(validationError.errors)) {
          const errorMessages = (validationError.errors as Record<string, string[]>)[errorKey];
          if (Array.isArray(errorMessages) && errorMessages.length > 0) {
            const descriptiveMsg = errorMessages.find((msg) => typeof msg === "string" && msg.length > 1 && !isErrorCode(msg));
            if (descriptiveMsg) return descriptiveMsg;
            const meaningfulMsg = errorMessages.find((msg) => typeof msg === "string" && msg.length > 1);
            if (meaningfulMsg) {
              if (isErrorCode(meaningfulMsg)) return getDefaultErrorMessage(meaningfulMsg);
              return meaningfulMsg;
            }
          }
        }
        if (validationError.title && validationError.title.length > 1) return validationError.title;
      }
    }
    if (validationError?.title && validationError.title.length > 1) return validationError.title;
    return "Validation error occurred";
  }
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as unknown;
      if (typeof data === "object" && data !== null && "message" in data) {
        const message = (data as { message: string }).message;
        if (typeof message === "string" && message.length > 1) return message;
      }
      if (typeof data === "string" && data.length > 1) return data;
    }
    if (error.message && error.message.length > 1) return error.message;
    return "An error occurred";
  }
  if (error instanceof Error) {
    if (error.message && error.message.length > 1) return error.message;
  }
  return "An unexpected error occurred";
};

export const extractValidationErrors = (error: unknown): Record<string, string[]> => {
  if (isValidationError(error)) {
    const validationError = error.response?.data;
    if (!validationError?.errors) return {};
    if (Array.isArray(validationError.errors)) {
      const fieldErrors: Record<string, string[]> = {};
      const errors = validationError.errors as string[];
      for (let i = 0; i < errors.length; i++) {
        const errorItem = errors[i];
        if (typeof errorItem !== "string") continue;
        if (isErrorCode(errorItem)) {
          const message = i + 1 < errors.length && typeof errors[i + 1] === "string" && !isErrorCode(errors[i + 1]) ? errors[i + 1] : null;
          const fieldName = mapErrorCodeToField(errorItem);
          if (fieldName) {
            const errorMessage = message || getDefaultErrorMessage(errorItem);
            fieldErrors[fieldName] = fieldErrors[fieldName] || [];
            fieldErrors[fieldName].push(errorMessage);
          } else {
            const errorMessage = message || errorItem;
            fieldErrors["root"] = fieldErrors["root"] || [];
            fieldErrors["root"].push(errorMessage);
          }
          if (message) i++;
        } else {
          const lowerError = errorItem.toLowerCase();
          let fieldName: string | null = null;
          if (lowerError.includes("username") || lowerError.includes("user name")) fieldName = "userName";
          else if (lowerError.includes("email")) fieldName = "email";
          else if (lowerError.includes("password")) fieldName = "password";
          else if (lowerError.includes("code") || lowerError.includes("verification")) fieldName = "code";
          if (fieldName) {
            fieldErrors[fieldName] = fieldErrors[fieldName] || [];
            fieldErrors[fieldName].push(errorItem);
          } else {
            fieldErrors["root"] = fieldErrors["root"] || [];
            fieldErrors["root"].push(errorItem);
          }
        }
      }
      return fieldErrors;
    }
    if (typeof validationError.errors === "object") {
      return validationError.errors as Record<string, string[]>;
    }
  }
  return {};
};

export const extractAllErrorMessages = (error: unknown): string[] => {
  const validationErrors = extractValidationErrors(error);
  const messages: string[] = [];
  Object.values(validationErrors).forEach((fieldErrors) => {
    messages.push(...fieldErrors);
  });
  return messages.length > 0 ? messages : [extractErrorMessage(error)];
};

export const setFormErrors = <T extends Record<string, unknown>>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMapping?: Record<string, keyof T>
): void => {
  const validationErrors = extractValidationErrors(error);
  if (Object.keys(validationErrors).length === 0) {
    const message = extractErrorMessage(error);
    setError("root" as Path<T>, { type: "server", message });
    return;
  }
  Object.entries(validationErrors).forEach(([fieldName, messages]) => {
    const formFieldName = (fieldMapping?.[fieldName] || fieldName) as keyof T;
    const errorMessage = Array.isArray(messages) ? messages[0] : messages;
    if (errorMessage) {
      setError(formFieldName as Path<T>, { type: "server", message: errorMessage });
    }
  });
};
