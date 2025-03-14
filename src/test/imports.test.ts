import { describe, expect, it } from 'vitest'

describe('import vue components', () => {
  it('normal imports as expected', async () => {
    const cmp = await import('../App.vue')
    expect(cmp).toBeDefined()
  })

  it('layout imports as expected', async () => {
    const cmp = await import(`../layouts/DefaultLayout.vue`)
    expect(cmp).toBeDefined()
  })

  it('dynamic imports as expected', async () => {
    const name = 'Hello'
    const cmp = await import(`../components/${name}.vue`)
    expect(cmp).toBeDefined()
  })
})
