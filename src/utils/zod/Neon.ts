import { z } from 'zod'

export const NeonExportCodec = z.array(
  z.object({
    Date: z.string().date(),
    Amount: z.string().transform(Number),
    Description: z.string().optional(),
    Category: z
      .string()
      .optional()
      .transform((_) => (_ === 'uncategorized' ? undefined : _)),
  })
)

export const NeonAccountsCodec = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    offbudget: z.boolean(),
    closed: z.boolean(),
  })
)
