import inquirer from 'inquirer'
import type { PackageManager } from '../types.js'

export function packageManagerPrompt() {
  return inquirer.prompt<{ packageManager: PackageManager }>([
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
}

export function registryPrompt() {
  return inquirer.prompt<{ registry: string }>([{
    name: 'registry',
    message: 'Select a registry below:',
    type: 'list',
    default: 'taobao',
    choices: [
      {
        name: 'taobao',
        value: 'https://registry.npmmirror.com/',
      },
      {
        name: 'npmjs',
        value: 'https://registry.npmjs.org',
      },
    ],
  }])
}
