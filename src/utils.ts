import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import process from 'process'
import path from 'path'
import { homedir } from 'os'
import { parseDocument } from 'yaml'
import { $ } from 'execa'
import { fileURLToPath } from 'url'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)

const root = join(__dirname, '../')
const rootPkg = join(root, './package.json')
export const isLocalDev = () => {
  const isLocal = existsSync(rootPkg) && require(rootPkg)._local
  return isLocal ? root : false
}

export function tryPath(path: string) {
  if (existsSync(path)) {
    return path
  }
}
export function tryPaths(paths: string[]) {
  for (const path of paths) {
    return tryPath(path)
  }
}

export function getVerdaccioHome(): string {
  const userDataDir =
    process.platform === 'win32'
      ? (process.env.APPDATA || path.join(homedir(), "AppData/Roaming"))
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
  } else {
    const config = getVerdaccioConfig()
    if (config) {
      if (path.isAbsolute(config.storage)) {
        return config.storage
      } else {
        return path.join(getVerdaccioHome(), config.storage)
      }
    }
  }
}

export async function getPnpmStorePath() {
  const { stdout } = await $`pnpm store path`
  return stdout
}
