import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    hmr: false,
  },
  build: {
    manifest: true,
    rolldownOptions: {
      input: {
        main: 'index.html',
        projects: 'src/pages/projects/client.ts',
        carrot: 'src/pages/carrot/client.ts',
        career: 'src/pages/career/client.ts',
      },
    },
  },
})
