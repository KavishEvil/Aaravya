import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  type: z.enum(["IN_CLINIC", "TELECONSULT"]),
  conditionId: z.string().optional(),
  doctorId: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
