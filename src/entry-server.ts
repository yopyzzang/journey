const pages: Record<string, Function | undefined> = import.meta.glob(
  './pages/**/*.ts',
)

export async function render(url: string) {
  const filePath = url ? `./pages/${url}/index.ts` : './pages/index.ts'

  const pageModule = pages[filePath]

  if (!pageModule) {
    return '<h1>Page not found</h1>'
  }

  const module = await pageModule()
  const { html, clientScript } = await module.renderPage()

  return { html, clientScript }
}
