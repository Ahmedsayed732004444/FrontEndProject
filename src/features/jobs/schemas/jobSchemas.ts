import { z } from "zod";

export const applyJobSchema = z.object({
  cv: z
    .any()
    .refine((files) => files && files.length > 0, "CV file is required")
    .transform((files) => files[0])
    .refine((file) => file.size <= 5 * 1024 * 1024, "CV file must be less than 5MB")
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "CV must be a PDF, DOC, or DOCX file"
    ),
  phone: z
    .string({ message: "Phone number is required" })
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .optional(),
});

