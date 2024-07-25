import * as actualBudget from '@actual-app/api'
import fs from 'fs'
const dataDir = `/tmp/downloads`

import { env } from './env'
import { Transaction } from './zod/Transaction'
import { NeonAccountsCodec } from './zod/Neon'

const withActualBudget =
  (syncId: string) =>
  async <T>(callback: () => Promise<T>): Promise<T> => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    await actualBudget.init({
      dataDir,
      serverURL: env.ACTUAL_BUDGET_SERVER_URL,
      password: env.ACTUAL_BUDGET_SERVER_PASSWORD,
    })

    await actualBudget.downloadBudget(syncId)

    const result = await callback()

    await actualBudget.shutdown()

    return result
  }

export const sendTransactions =
  (syncId: string) =>
  (data: { transactions: Transaction[]; accountId: string }) =>
    withActualBudget(syncId)(async () => {
      await actualBudget.importTransactions(data.accountId, data.transactions)
    })

export const getAccounts = (syncId: string) => async () => {
  const result = await withActualBudget(syncId)(actualBudget.getAccounts)
  return NeonAccountsCodec.parse(result)
}
