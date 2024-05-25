import { z } from 'zod'

export const NeonExport = z.array(
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
