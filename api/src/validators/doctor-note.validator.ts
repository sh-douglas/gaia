import { z } from "zod";

const createDoctorNoteSchema = z.object({
  issuedAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "The issued date must be in YYYY-MM-DD format.",
    )
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year!, month! - 1, day!);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month! - 1 &&
        date.getDate() === day
      );
    }, "The issued date must be valid.")
    .transform((value) => {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year!, month! - 1, day!);
    })
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return value <= today;
    }, "The issued date cannot be in the future."),

  restDays: z.coerce.number().positive().int(),
  doctorName: z
    .string()
    .trim()
    .min(3, "The doctor name field must contain at least 3 characters"),
  crm: z
    .string()
    .trim()
    .min(1, "The CRM field cannot be empty.")
    .regex(/^\d+$/, "The CRM field must contain only numbers."),
  clinic: z
    .string()
    .trim()
    .min(3, "The clinic field must contain at least 3 characters."),
  noteType: z
    .string()
    .trim()
    .min(3, "The note type field must contain at least 3 characters."),
  cid: z
    .string()
    .trim()
    .min(3, "The cid field must contain at least 3 characters."),
  observation: z.string().trim().optional(),
});

type CreateDoctorNoteInput = z.infer<typeof createDoctorNoteSchema>;

export { type CreateDoctorNoteInput, createDoctorNoteSchema };
