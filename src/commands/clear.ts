import { readdirSync } from 'node:fs'
import * as path from 'node:path'
import { rimrafSync } from 'rimraf'
import chalk from 'chalk'
import { getPnpmStorePath, getVerdaccioStoragePath } from '../utils.js'

function rm(pathLike: string) {
  const paths = readdirSync(pathLike)
  paths.forEach((p) => {
    const dir = path.join(pathLike, p)
    console.log(chalk.gray(`  deleting ${dir}`))
    rimrafSync(dir)
  })
}

export default async function (params: { pnpmStore: boolean }) {
  if (params.pnpmStore) {
    console.log(chalk.green('cleaning pnpm-store...'))
    const storePath = await getPnpmStorePath()
    if (storePath)
      rm(storePath)

    console.log(chalk.green('clean pnpm-store finished'))
  }

  console.log(chalk.green('cleaning verdaccio storage...'))
  const storagePath = getVerdaccioStoragePath()
  if (storagePath)
    rm(storagePath)

  console.log(chalk.green('clean verdaccio storage finished'))
}
