import { z } from 'zod'

export const NeonExportCodec = z.array(
  z.object({
    Date: z.string().date(),
    Amount: z.string().transform(Number),
    Description: z.string().nullish(),
    Category: z
      .string()
      .nullish()
      .transform((_) => (_ === 'uncategorized' ? null : _)),
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
