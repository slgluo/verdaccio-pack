import { readdirSync } from 'node:fs'
import * as path from 'node:path'
import * as console from 'node:console'
import { rimrafSync } from 'rimraf'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { $ } from 'execa'
import { getPnpmStorePath, getVerdaccioStoragePath } from '../utils.js'

function rm(pathLike: string) {
  const paths = readdirSync(pathLike)
  paths.forEach((p) => {
    const dir = path.join(pathLike, p)
    console.log(chalk.gray(`  deleting ${dir}`))
    rimrafSync(dir)
  })
}

export default async function () {
  const result = await inquirer.prompt<{ packageManager: 'npm' | 'yarn' | 'pnpm' }>([
    {
      name: 'packageManager',
      message: 'which package manager will you use?',
      type: 'list',
      default: 'npm',
      choices: [
        {
          name: 'npm',
          value: 'npm',
        },
        {
          name: 'yarn',
          value: 'yarn',
        },
        {
          name: 'pnpm',
          value: 'pnpm',
        },
      ],
    },
  ])

  const { packageManager } = result
  console.log('you select:', packageManager)
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

  console.log(chalk.green('cleaning verdaccio storage...'))
  const storagePath = getVerdaccioStoragePath()
  if (storagePath)
    rm(storagePath)

  console.log(chalk.green('clean verdaccio storage finished'))
}
