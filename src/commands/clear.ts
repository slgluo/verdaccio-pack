import { readdirSync } from 'node:fs'
import * as path from 'node:path'
import * as console from 'node:console'
import { rimrafSync } from 'rimraf'
import chalk from 'chalk'
import { $ } from 'execa'
import { getPnpmStorePath, getVerdaccioStoragePath } from '../utils.js'
import { packageManagerPrompt } from '../prompts/index.js'

function rm(pathLike: string) {
  const paths = readdirSync(pathLike)
  paths.forEach((p) => {
    const dir = path.join(pathLike, p)
    console.log(chalk.gray(`  deleting ${dir}`))
    rimrafSync(dir)
  })
}

export default async function () {
  const result = await packageManagerPrompt()
  const { packageManager } = result

  try {
    if (packageManager === 'npm') {
      await $({ stdio: 'inherit' })`npm cache clean --force`
    }
    else if (packageManager === 'yarn') {
      await $({ stdio: 'inherit' })`yarn cache clean`
    }
    else if (packageManager === 'pnpm') {
      console.log(chalk.green('cleaning pnpm-store...'))
      const storePath = await getPnpmStorePath()
      if (storePath)
        rm(storePath)

      console.log(chalk.green('clean pnpm-store finished'))
    }
  }
  catch (e) {
    console.error(chalk.red(`${packageManager} clean cache failed`))
  }

  console.log(chalk.green('cleaning verdaccio storage...'))
  const storagePath = getVerdaccioStoragePath()
  if (storagePath)
    rm(storagePath)

  console.log(chalk.green('clean verdaccio storage finished'))
}
