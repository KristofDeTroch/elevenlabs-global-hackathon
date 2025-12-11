import { z } from "zod";

export const caseFormSchema = z.object({
  originalAmount: z
    .string()
    .min(1, "Original amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Original amount must be a positive number",
    }),
  currentBalance: z
    .string()
    .min(1, "Current balance is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Current balance must be a positive number",
    }),
  interestRate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Interest rate must be a non-negative number",
    }),
  externalReference: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  lastContactDate: z.string().optional().nullable(),
  nextActionDate: z.string().optional().nullable(),
});

export type CaseFormData = z.infer<typeof caseFormSchema>;
