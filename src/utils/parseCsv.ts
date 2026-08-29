import csv from 'csvtojson'
import { utils } from '@actual-app/api'
import { NeonExportCodec } from './zod/Neon'
import { Transaction } from './zod/Transaction'

export async function parseCsvToTransactions(
  csvData: string,
  accountId: string
): Promise<Transaction[]> {
  const rows = await csv({ delimiter: ';', quote: `"` }).fromString(csvData)
  const data = NeonExportCodec.parse(rows)

  return data.map(({ Date, Amount, Description, Subject }) => ({
    account: accountId,
    date: Date,
    amount: utils.amountToInteger(Amount),
    payee_name: Description,
    imported_payee: Description,
    ...(Subject && Subject !== Description ? { notes: Subject } : {}),
    cleared: true,
  }))
}
