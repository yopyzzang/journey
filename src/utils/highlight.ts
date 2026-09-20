import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import nginx from 'highlight.js/lib/languages/nginx'
import plaintext from 'highlight.js/lib/languages/plaintext'
import 'highlight.js/styles/vs-dark.css'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('nginx', nginx)

export function highlightCode(code: string, language: string) {
  return hljs.highlight(code, {
    language,
    ignoreIllegals: true,
  }).value
}
