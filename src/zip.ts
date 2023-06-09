'use strict'
import type { WriteStream } from 'node:fs'
import * as path from 'node:path'
import * as fs from 'node:fs'
import archiver from 'archiver'

// fork from git+https://github.com/maugenst/zip-a-folder.git
// author: Marius Augenstein

export enum COMPRESSION_LEVEL {
  uncompressed = 0,
  medium = 5,
  high = 9,
}

/**
 * Options to pass in to zip a folder
 * compression default is 'high'
 */
export interface ZipAFolderOptions {
  compression?: COMPRESSION_LEVEL
  customWriteStream?: WriteStream
  exclude?: string | string[] | RegExp | RegExp[]
}

export class ZipAFolder {
  /**
   * Tars a given folder into a gzipped tar archive.
   * If no zipAFolderOptions are passed in, the default compression level is high.
   * @param srcFolder
   * @param tarFilePath
   * @param zipAFolderOptions
   */
  static async tar(
    srcFolder: string,
    tarFilePath: string | undefined,
    zipAFolderOptions?: ZipAFolderOptions,
  ): Promise<void | Error> {
    const o: ZipAFolderOptions = zipAFolderOptions || {
      compression: COMPRESSION_LEVEL.high,
    }

    if (o.compression === COMPRESSION_LEVEL.uncompressed) {
      await ZipAFolder.compress({
        srcFolder,
        targetFilePath: tarFilePath,
        format: 'tar',
        zipAFolderOptions,
      })
    }
    else {
      await ZipAFolder.compress({
        srcFolder,
        targetFilePath: tarFilePath,
        format: 'tar',
        zipAFolderOptions,
        archiverOptions: {
          gzip: true,
          gzipOptions: {
            level: o.compression,
          },
        },
      })
    }
  }

  /**
   * Zips a given folder into a zip archive.
   * If no zipAFolderOptions are passed in, the default compression level is high.
   * @param srcFolder
   * @param tarFilePath
   * @param zipAFolderOptions
   */
  static async zip(
    srcFolder: string,
    zipFilePath: string | undefined,
    zipAFolderOptions?: ZipAFolderOptions,
  ): Promise<void | Error> {
    const o: ZipAFolderOptions = zipAFolderOptions || {
      compression: COMPRESSION_LEVEL.high,
    }

    if (o.compression === COMPRESSION_LEVEL.uncompressed) {
      await ZipAFolder.compress({
        srcFolder,
        targetFilePath: zipFilePath,
        format: 'zip',
        zipAFolderOptions,
        archiverOptions: {
          store: true,
        },
      })
    }
    else {
      await ZipAFolder.compress({
        srcFolder,
        targetFilePath: zipFilePath,
        format: 'zip',
        zipAFolderOptions,
        archiverOptions: {
          zlib: {
            level: o.compression,
          },
        },
      })
    }
  }

  private static async compress({
    srcFolder,
    targetFilePath,
    format,
    zipAFolderOptions,
    archiverOptions,
  }: {
    srcFolder: string
    targetFilePath?: string
    format: archiver.Format
    zipAFolderOptions?: ZipAFolderOptions
    archiverOptions?: archiver.ArchiverOptions
  }): Promise<void | Error> {
    let output: WriteStream

    if (!zipAFolderOptions?.customWriteStream && targetFilePath) {
      const targetBasePath: string = path.dirname(targetFilePath)

      if (targetBasePath === srcFolder)
        throw new Error('Source and target folder must be different.')

      try {
        await fs.promises.access(srcFolder, fs.constants.R_OK)
        await fs.promises.access(
          targetBasePath,
          fs.constants.R_OK | fs.constants.W_OK,
        )
      }
      catch (e: any) {
        throw new Error(`Permission error: ${e.message}`)
      }
      output = fs.createWriteStream(targetFilePath)
    }
    else if (zipAFolderOptions && zipAFolderOptions.customWriteStream) {
      output = zipAFolderOptions?.customWriteStream
    }
    else {
      throw new Error(
        'You must either provide a target file path or a custom write stream to write to.',
      )
    }

    const zipArchive: archiver.Archiver = archiver(
      format,
      archiverOptions || {},
    )

    const exclude = zipAFolderOptions?.exclude
    let excludes: RegExp[] = []
    if (exclude) {
      if (Array.isArray(exclude)) {
        excludes = exclude.map(e =>
          typeof e === 'string' ? new RegExp(e) : e,
        )
      }
      else {
        excludes
          = typeof exclude === 'string' ? [new RegExp(exclude)] : [exclude]
      }
    }

    return new Promise((resolve, reject) => {
      output.on('close', resolve)
      output.on('error', reject)

      const zipRootName = targetFilePath
        ? path.basename(targetFilePath).split('.')[0] // file带后缀名
        : path.basename(srcFolder)

      zipArchive.pipe(output)
      zipArchive.directory(srcFolder, zipRootName, (entry) => {
        const isExclude = excludes.some(e => e.test(entry.name))
        return isExclude ? false : entry
      })
      zipArchive.finalize()
    })
  }
}

export const zip = ZipAFolder.zip
export const tar = ZipAFolder.tar
