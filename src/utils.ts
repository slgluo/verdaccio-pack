import { existsSync, readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { parseDocument } from 'yaml'
import { $ } from 'execa'
import { findConfigFile } from '@verdaccio/config'
import type { Config } from '@verdaccio/config'

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
  return path.dirname(findConfigFile())
}

export function getVerdaccioConfig(): Config {
  const configPath = findConfigFile()
  const content = readFileSync(configPath, 'utf-8')
  const doc = parseDocument(content)
  return doc.toJS()
}

export function getVerdaccioStoragePath() {
  const storagePath = process.env.VERDACCIO_STORAGE_PATH
  if (storagePath) {
    return storagePath
  }
  else {
    const config = getVerdaccioConfig()
    if (config.storage) {
      if (path.isAbsolute(config.storage))
        return config.storage
      else
        return path.resolve(getVerdaccioHome(), config.storage)
    }
  }
}

export async function getPnpmStorePath() {
  const { stdout } = await $`pnpm store path`
  return stdout
}
