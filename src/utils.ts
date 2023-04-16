import { existsSync, readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import process from 'node:process'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { parseDocument } from 'yaml'
import { $ } from 'execa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)

const root = join(__dirname, '../')
const rootPkg = join(root, './package.json')
export function isLocalDev() {
  const isLocal = existsSync(rootPkg) && require(rootPkg)._local
  return isLocal ? root : false
}

export function tryPath(path: string) {
  if (existsSync(path))
    return path
}

export function getVerdaccioHome(): string {
  const userDataDir
    = process.platform === 'win32'
      ? (process.env.APPDATA || path.join(homedir(), 'AppData/Roaming'))
      : path.join(homedir(), '.config')
  return path.join(userDataDir, 'verdaccio')
}

export function getVerdaccioConfig() {
  const configPath = tryPath(path.join(getVerdaccioHome(), 'config.yaml'))
  if (configPath) {
    const content = readFileSync(configPath, 'utf-8')
    const doc = parseDocument(content)
    return doc.toJS()
  }
}

export function getVerdaccioStoragePath() {
  const storagePath = process.env.VERDACCIO_STORAGE_PATH
  if (storagePath) {
    return storagePath
  }
  else {
    const config = getVerdaccioConfig()
    if (config) {
      if (path.isAbsolute(config.storage))
        return config.storage
      else
        return path.join(getVerdaccioHome(), config.storage)
    }
  }
}

export async function getPnpmStorePath() {
  const { stdout } = await $`aaa store path`
  return stdout
}
