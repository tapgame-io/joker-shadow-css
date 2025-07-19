import type { Plugin } from 'vite';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Insert CSS to JS placeholder in target file, for fine using css with shadow-dom
 * @param getCss - function that returns CSS
 * @param options - options
 * @param options.targetFile - path to target file
 * @param options.placeholder - placeholder to replace with CSS
 * @param options.apply - apply plugin to build or serve
 * @returns Vite plugin
 *
 * @example
 * ```ts
 * insertCssToJsPlaceholderPlugin(() => collectedCss, {
 *     targetFile: resolve(resolve(__dirname, 'dist'), 'integration.es.js'),
 *     placeholder: '"APP_STYLES_PLACEHOLDER"',
 * });
 * ```
 */
function insertCssToJsPlaceholderPlugin(
  getCss: () => string,
  options: {
    targetFile: string;
      placeholder: string;
      apply?: Plugin['apply'];
  },
): Plugin {
  return {
      name: 'insert-css-to-js-placeholder',
      apply: options.apply || 'build',
      closeBundle() {
          const css = getCss();

          const targetFile = options.targetFile;

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