import { Middleware } from '@oakserver/oak'
import { env } from './utils/env'

export const auth: Middleware = (context, next) => {
  const authHeader = context.request.headers.get('Authorization')
  const password = env.ACTUAL_BUDGET_SERVER_PASSWORD

  if (authHeader === password) {
    return next()
  }

  context.response.status = 401
  context.response.body = { message: 'Unauthorized' }
}
