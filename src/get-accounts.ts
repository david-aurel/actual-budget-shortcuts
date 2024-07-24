import { RouterMiddleware } from '@oakserver/oak'
import * as actualBudget from './utils/actualBudget'

export const getAccounts: RouterMiddleware<'/:syncId/get-accounts'> = async (
  context
) => {
  const { syncId } = context.params
  const accounts = await actualBudget.getAccounts(syncId)()
  context.response.body = accounts
}
