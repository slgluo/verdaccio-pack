import { readdirSync } from 'fs'
import * as path from 'path'
import { rimrafSync } from 'rimraf'
import { getPnpmStorePath, getVerdaccioStoragePath } from '../utils.js'
import chalk from 'chalk'

function rm(pathLike: string) {
  const paths = readdirSync(pathLike)
  paths.forEach((p) => {
    const dir = path.join(pathLike, p)
    console.log(chalk.gray(`  正在删除 ${dir}`))
    rimrafSync(dir)
  })
}

export default async function () {
  console.log(chalk.green('正在清理pnpm缓存...'))
  const storePath = await getPnpmStorePath()
  if (storePath) {
    rm(storePath)
  }
  console.log(chalk.green('清理pnpm缓存完毕'))

  console.log(chalk.green('正在清理verdaccio storage...'))
  const storagePath = getVerdaccioStoragePath()
  if (storagePath) {
    rm(storagePath)
  }
  console.log(chalk.green('清理verdaccio storage完毕'))
}
