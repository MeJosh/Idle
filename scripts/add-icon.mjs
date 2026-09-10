import { constants } from 'node:fs'
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const padded = args[0] === '--padding'
const iconPath = args[padded ? 1 : 0]

if (!iconPath || args.length !== (padded ? 2 : 1)) {
  console.error('Usage: pnpm icon:add -- [--padding] <category/icon.svg>')
  process.exit(1)
}

if (extname(iconPath).toLowerCase() !== '.svg') {
  console.error('Only SVG icons can be added.')
  process.exit(1)
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const variant = padded ? 'padding' : 'no-padding'
const sourceRoot = resolve(projectRoot, 'art/icon-packs/game-icons-v1.4', variant)
const source = resolve(sourceRoot, iconPath)
const sourceRelativePath = relative(sourceRoot, source)

if (
  sourceRelativePath === '..' ||
  sourceRelativePath.startsWith(`..${sep}`) ||
  sourceRelativePath.startsWith(sep)
) {
  console.error('Icon path must stay inside the selected icon-pack variant.')
  process.exit(1)
}

const destination = resolve(projectRoot, 'src/assets/icons', sourceRelativePath)

try {
  await mkdir(dirname(destination), { recursive: true })
  await copyFile(source, destination, constants.COPYFILE_EXCL)
  console.log(`Added ${variant}/${sourceRelativePath} to src/assets/icons/${sourceRelativePath}`)
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.error(`Icon not found: ${variant}/${sourceRelativePath}`)
    process.exit(1)
  }

  if (error?.code === 'EEXIST') {
    console.error(`Icon already exists: src/assets/icons/${sourceRelativePath}`)
    process.exit(1)
  }

  throw error
}
