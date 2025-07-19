# joker-shadow-css
An vite plugin to inject css to shadow-dom after build application

## Install

```bash
pnpm add joker-shadow-css
```

## Usage

```ts
import { defineConfig } from 'vite';
import { insertCssToJsPlaceholderPlugin } from 'joker-shadow-css';
import css from 'vite-plugin-css-injected-by-js';

let collectedCss = '';

defineConfig({
  plugins: [
      //  ... other plugins
      css({
          injectCode: (css) => {
              collectedCss = css;
              return css;
          },
      }),
      insertCssToJsPlaceholderPlugin(() => collectedCss, {
          targetFile: resolve(resolve(__dirname, 'dist'), 'integration.es.js'),
          placeholder: '"APP_STYLES_PLACEHOLDER"',
      }),
  ],
)}
```

<!-- in dist/integration.es.js -->
```ts
  const appStyles = new CSSStyleSheet();
  appStyles.replaceSync('APP_STYLES_PLACEHOLDER);
  const shadowRoot = container.attachShadow({ mode: 'open' });

  shadowRoot.adoptedStyleSheets = [appStyles];
  shadowRoot.appendChild(wrapper);
```

