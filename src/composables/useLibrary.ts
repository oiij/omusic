import type { IAudioMetadata } from 'music-metadata'
import { Store } from '@tauri-apps/plugin-store'

export interface Library {
  path: string
  name: string
  createAt: number
  size: number
  tagRaw?: IAudioMetadata
  tag: {
    album: string
    albumartist: string
    artist: string
    artists: string[]
    title: string
    year: string
  }
}
export async function useLibrary() {
  const store = await Store.load('library.bin')
  async function has(key: string) {
    return store.has(key)
  }
  async function set(key: string, value: any) {
    return store.set(key, value)
  }
  async function get(key: string) {
    return store.get<Library>(key)
  }
  async function getAll() {
    return store.values<Library>()
  }
  async function clear() {
    return store.clear()
  }
  async function save() {
    return store.save()
  }
  return {
    store,
    has,
    set,
    get,
    getAll,
    clear,
    save,
  }
}
