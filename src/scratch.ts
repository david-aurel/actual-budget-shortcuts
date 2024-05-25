import os from 'os'
import fs from 'fs'
import child_process from 'child_process'

const dirPathLevel1 = `./downloads`
const dirPathLevel2 = `${dirPathLevel1}/My-test-folder`
const filePath = `${dirPathLevel2}/test.txt`

console.log('userInfo:', os.userInfo())

!fs.existsSync(filePath) && fs.mkdirSync(dirPathLevel2)
fs.writeFileSync(filePath, `test`)

const file = fs.readFileSync(filePath)
console.log('file: ', file.toString('utf-8'))

fs.writeFileSync(filePath, `test updated`)

const fileAfterUpdate = fs.readFileSync(filePath)
console.log('file after update: ', fileAfterUpdate.toString('utf-8'))

child_process.exec('ls -lR ./downloads', (error, stdout, stderr) => {
  if (error) {
    console.log(`ls -lR error: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`ls -lR stderr: ${stderr}`)
    return
  }
  console.log(`ls -lR stdout: ${stdout}`)
})
