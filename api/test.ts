import { VercelRequest, VercelResponse } from '@vercel/node'

import fs from 'fs'
import path from 'path'

const migrationsPath = path.resolve(__dirname, '../node_modules')

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  console.log(request.url)
  await fs.readdir(migrationsPath, (err, files) => {
    if (err) {
      throw new Error(`Error reading ${migrationsPath} directoy :`, err)
    } else {
      throw new Error(`${migrationsPath} directory contents: ${files}`)
    }
  })
  return response.status(200).end()
}
