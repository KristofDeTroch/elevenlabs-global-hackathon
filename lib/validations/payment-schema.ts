import { z } from "zod";

export const createPaymentLinkSchema = z.object({
  caseId: z.string().uuid("Invalid case ID"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().min(1, "Customer name is required"),
});

export type CreatePaymentLinkData = z.infer<typeof createPaymentLinkSchema>;
