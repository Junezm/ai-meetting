import { z } from 'zod';

export const agentsInsertSchema = z.object({
  name: z.string().min(1),
  instructions: z.string().min(1),
})