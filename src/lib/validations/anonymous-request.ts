import { z } from "zod";

export const anonymousRequestSchema = z.object({
  nickname: z.string().trim().min(1, "A nickname or initials is enough").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number — this is only used to send your video link"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  preferFemaleDoctor: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type AnonymousRequestInput = z.infer<typeof anonymousRequestSchema>;
