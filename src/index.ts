import { Command } from 'commander'
import { ClearCommand, PackCommand } from './commands/index.js'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

export default async () => {
  const program = new Command()
  program
    .name(Reflect.ownKeys(pkg.bin)[0] as string)
    .description(pkg.description)
    .usage('<command> [options]')
    .version(pkg.version, '-v, --version', '显示cli当前版本')
    .addHelpCommand('help [command]', '显示命令帮助信息')
    .helpOption('-h, --help', '显示命令帮助信息')

  program
    .command('clear')
    .description('清除pnpm store目录和verdaccio storage目录')
    .action(ClearCommand)

  program
    .command('pack')
    .description('打包verdaccio storage成zip压缩文件')
    .action(PackCommand)

  program.parse(process.argv)
}
