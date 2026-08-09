const pages: Record<string, Function | undefined> = import.meta.glob(
  './pages/**/*.ts',
)

export async function render(url: string) {
  const filePath = `./pages/${url === '/' ? '/home' : url}/index.ts`
  const pageModule = pages[filePath]

  console.log(pages)
  console.log('filePath', filePath)
  console.log('pageModule', pageModule)

  if (!pageModule) {
    return '<h1>Page not found</h1>'
  }

  const module = await pageModule()
  return module.renderPage()
}
