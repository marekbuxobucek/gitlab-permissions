import fs from 'fs'
import chalk from 'chalk'

import fileConfig from '../config/file.js'

/**
 *
 * @param {String} fileName
 * @param {String} data
 */
export const writeToFile = async (fileName,data) => {
  const fullPath = `${fileConfig.fileRoot}/${fileName}`
  await fs.mkdirSync(fileConfig.fileRoot, { recursive: true })

  fs.writeFile(fullPath, data, (err) => {

    if (err) throw err;
    console.log(`${chalk.blue('FileSystem: ')} ${chalk.green('successfully created file ')} ${chalk.yellow(fullPath)}`)
  })
}