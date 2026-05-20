import { z } from "zod";

const currentYear = new Date().getFullYear();

export const basicInfoSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters").max(100, "First name must be at most 100 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(100, "Last name must be at most 100 characters"),
  gender: z.union([z.literal(0), z.literal(1)]).nullable().optional(),
  country: z.string().min(3, "Country must be at least 3 characters").max(100, "Country must be at most 100 characters").nullable().optional(),
  city: z.string().min(3, "City must be at least 3 characters").max(100, "City must be at most 100 characters").nullable().optional(),
  jobTitle: z.string().min(3, "Job title must be at least 3 characters").max(200, "Job title must be at most 200 characters").nullable().optional(),
  yearsOfExperience: z.number().min(0, "Years of experience must be at least 0").max(50, "Years of experience must be at most 50").nullable().optional(),
  currentCompany: z.string().min(3, "Company name must be at least 3 characters").max(200, "Company name must be at most 200 characters").nullable().optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(1000, "Summary must be at most 1000 characters").nullable().optional(),
  university: z.string().min(3, "University name must be at least 3 characters").max(200, "University name must be at most 200 characters").nullable().optional(),
  degree: z.string().min(2, "Degree must be at least 2 characters").max(100, "Degree must be at most 100 characters").nullable().optional(),
  graduationYear: z.number().min(1950, "Graduation year must be at least 1950").max(currentYear, `Graduation year must be at most ${currentYear}`).nullable().optional(),
  skills: z.array(z.string().min(2, "Each skill must be at least 2 characters").max(50, "Each skill must be at most 50 characters")).max(20, "Maximum 20 skills allowed").optional(),
});

export const profilePictureSchema = z.object({
  profilePicture: z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Only JPEG and PNG files are allowed"),
});

export const coverPictureSchema = z.object({
  coverPicture: z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Only JPEG and PNG files are allowed"),
});

export const cvSchema = z.object({
  cvFile: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine((file) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type), "Only PDF and Word files are allowed"),
});
