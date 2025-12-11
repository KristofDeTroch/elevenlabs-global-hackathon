import { z } from "zod";

export const debtorFormSchema = z
  .object({
    type: z.enum(["INDIVIDUAL", "COMPANY"]),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "INDIVIDUAL") {
        return !!(data.firstName || data.lastName);
      }
      return true;
    },
    {
      message: "First name or last name is required for individuals",
      path: ["firstName"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "COMPANY") {
        return !!data.companyName;
      }
      return true;
    },
    {
      message: "Company name is required for companies",
      path: ["companyName"],
    }
  );

export type DebtorFormData = z.infer<typeof debtorFormSchema>;
