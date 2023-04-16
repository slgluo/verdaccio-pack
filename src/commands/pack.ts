import path from 'node:path'
import chalk from 'chalk'
import { getVerdaccioStoragePath } from '../utils.js'
import { zip } from '../zip.js'

export default async function ({ target }: { target?: string }) {
  const storagePath = getVerdaccioStoragePath()

  if (storagePath) {
    console.log(chalk.green('正在压缩...'))
    target = target || process.cwd()
    const zipPath = path.join(target, 'storage-patch.zip')
    await zip(storagePath, zipPath, {
      exclude: '.verdaccio-db.json',
    })
    console.log(chalk.green(`压缩完成：${zipPath}`))
  }
}
