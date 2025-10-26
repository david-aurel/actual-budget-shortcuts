import { z } from 'zod'


const BaseTransaction = z.object({
  id: z.string().optional(),
  account: z.string(),
  date: z.string(),
  amount: z.number(),
  payee: z.string().optional(),
  payee_name: z.string().optional(),
  imported_payee: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
  imported_id: z.string().optional(),
  transfer_id: z.string().optional(),
  cleared: z.boolean().optional(),
})

export type Transaction = z.infer<typeof BaseTransaction> & {
  subtransactions?: Transaction[]
}

export const Transaction: z.ZodType<Transaction> = BaseTransaction.extend({
  subtransactions: z.lazy(() => Transaction.array()).optional(),
})
