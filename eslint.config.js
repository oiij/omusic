import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: true,
  ignores: ['src/assets', 'public', '**/src-tauri/**'],
})
