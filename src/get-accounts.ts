import { RouterMiddleware } from '@oakserver/oak'
import * as actualBudget from './utils/actualBudget'

export const getAccounts: RouterMiddleware<'/:syncId/get-accounts'> = async (
  context
) => {
  const { syncId } = context.params

  try {
    const accounts = await actualBudget.getAccounts(syncId)()
    context.response.body = accounts
  } catch (error) {
    console.error(error)
    context.response.status = 500
    context.response.body = {
      message: error instanceof Error ? error.message : 'Unknown Error',
    }
  }
}
