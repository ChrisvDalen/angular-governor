import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import fastGlob from 'fast-glob';
import type { ProjectFile } from '../domain/rule.js';

const SOURCE_PATTERNS = [
  '**/*.{ts,html,css,scss,sass,less,json,js,mjs,cjs,yml,yaml}',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
];

const IGNORED_DIRECTORIES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out-tsc/**',
  '**/coverage/**',
  '**/.git/**',
  '**/.angular/**',
  '**/.angular-governor/**',
  '**/.nx/**',
];

const MAX_FILE_SIZE_BYTES = 1024 * 1024;

export async function discoverFiles(rootPath: string): Promise<ProjectFile[]> {
  const paths = await fastGlob(SOURCE_PATTERNS, {
    cwd: rootPath,
    ignore: IGNORED_DIRECTORIES,
    onlyFiles: true,
    dot: false,
  });

  const files: ProjectFile[] = [];
  for (const relativePath of paths.sort()) {
    const absolutePath = path.join(rootPath, relativePath);
    const stats = await fs.stat(absolutePath);
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      continue;
    }
    const extension = path.extname(relativePath);
    const content = isBinaryExtension(extension)
      ? ''
      : await fs.readFile(absolutePath, 'utf8');
    files.push({ path: relativePath, content, extension });
  }
  return files;
}

function isBinaryExtension(extension: string): boolean {
  return extension === '.lockb';
}
