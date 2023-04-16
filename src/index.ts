import { createRequire } from 'node:module'
import { Command } from 'commander'
import { ClearCommand, PackCommand } from './commands/index.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

export default async () => {
  const program = new Command()
  program
    .name(Reflect.ownKeys(pkg.bin)[0] as string)
    .description(pkg.description)
    .usage('<command> [options]')
    .version(pkg.version, '-v, --version', 'display current version of the cli')
    .addHelpCommand('help [command]', 'display help for command')
    .helpOption('-h, --help', 'display help for command')

  program
    .command('clear')
    .description('clean verdaccio local storage')
    .action(ClearCommand)

  program
    .command('pack')
    .description('pack verdaccio local storage to a zip file')
    .action(PackCommand)

  program.parse(process.argv)
}
