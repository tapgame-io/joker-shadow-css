import type { Plugin } from 'vite';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Insert CSS to JS placeholder in target file, for fine using css with shadow-dom
 * @param getCss - function that returns CSS
 * @param options - options
 * @param options.originalTargetFile - path to target file
 * @param options.targetDir - path to target directory
 * @param options.placeholder - placeholder to replace with CSS
 * @param options.apply - apply plugin to build or serve
 * @returns Vite plugin
 *
 * @example
 * ```ts
 * insertCssToJsPlaceholderPlugin(() => collectedCss, {
 *     originalTargetFile: 'integration.es.js',
 *     targetDir: 'dist',
 * });
 * ```
 */
function insertCssToJsPlaceholderPlugin(
  getCss: () => string,
  options: {
      originalTargetFile: string;
      placeholder: string;
      targetDir: string;
      apply?: Plugin['apply'];
  },
): Plugin {
  return {
      name: 'insert-css-to-js-placeholder',
      apply: options.apply || 'build',
      closeBundle() {
          const css = getCss();

          const distDir = resolve(__dirname, options.targetDir);
          const targetFile = resolve(distDir, options.originalTargetFile);

          // Patch target file
          if (existsSync(targetFile)) {
              const originalCode = readFileSync(targetFile, 'utf-8');
              const patchedCode = originalCode.replace(options.placeholder, css);

              writeFileSync(targetFile, patchedCode, 'utf-8');
              console.log(`[vite-plugin] ✅ Patched ${targetFile} with CSS`);
          } else {
              console.warn(`[vite-plugin] ❌ Cannot find ${targetFile} to patch with CSS`);
          }
      },
  };
}

export default insertCssToJsPlaceholderPlugin;