import { VercelRequest, VercelResponse } from '@vercel/node'

import { getAccounts } from '../../src/actualBudget'
import { env } from '../../src/env'

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).send('Method not allowed')
  }
  const authHeader = request.headers['authorization']
  if (!authHeader || authHeader !== env.ACTUAL_BUDGET_SERVER_PASSWORD) {
    return response.status(401).send('Unauthorized')
  }

  const syncId = request.query['syncId'] as string

  const accounts = await getAccounts(syncId)()

  return response.setHeader('Content-Type', 'application/json').send(accounts)
}
