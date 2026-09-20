import fs from 'node:fs/promises'
import express from 'express'
import manifest from './dist/client/.vite/manifest.json' with { type: 'json' }

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

function collectCss(entryKey, manifest, seen = new Set()) {
  if (seen.has(entryKey)) return []
  seen.add(entryKey)

  const chunk = manifest[entryKey]
  if (!chunk) return []

  const css = [...(chunk.css ?? [])]

  for (const importedKey of chunk.imports ?? []) {
    css.push(...collectCss(importedKey, manifest, seen))
  }

  return css
}

function resolveClientAssets(sourcePath) {
  if (process.env.NODE_ENV !== 'production') {
    return { script: `/${sourcePath}`, css: [] }
  }

  const entry = manifest[sourcePath]
  if (!entry) {
    throw new Error(`manifest에서 ${sourcePath} 엔트리를 찾을 수 없습니다.`)
  }
  const cssFiles = [...new Set(collectCss(sourcePath, manifest))]

  return {
    script: `/${entry.file}`,
    css: cssFiles.map((href) => `/${href}`),
  }
}

const app = express()

/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.ts').render} */
    let render
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)
    const { script, css } = rendered.clientScript
      ? resolveClientAssets(rendered.clientScript)
      : { script: null, css: [] }
    const cssLinks = css
      .map((href) => `<link rel="stylesheet" href="${href}">`)
      .join('\n')

    const html = template
      .replace(`<!--app-head-->`, (rendered.head ?? '') + cssLinks)
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(
        `<!--app-script-->`,
        script ? `<script type="module" src="${script}"></script>` : '',
      )

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
