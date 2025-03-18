import type { IAudioMetadata, IPicture } from 'music-metadata'
import { basename } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { Store } from '@tauri-apps/plugin-store'
import { parseBuffer } from 'music-metadata'

export interface MediaLibrary {
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
    year: number
    bitrate: number
    duration: number
    sampleRate: number
    picture?: IPicture
  }
}
export async function useMediaLibrary() {
  const store = await Store.load('library.bin')
  async function has(key: string) {
    return store.has(key)
  }
  async function set(key: string, value: any) {
    return store.set(key, value)
  }
  async function get(key: string) {
    return store.get<MediaLibrary>(key)
  }
  async function getAll() {
    const data = await store.values<MediaLibrary>()

    return data.map((m) => {
      return m.tag.picture && Array.isArray(m.tag.picture.data)
        ? {
            ...m,
            tag: {
              ...m.tag,
              picture: {
                ...m.tag.picture,
                data: new Uint8Array(m.tag.picture.data),
              },
            },
          }
        : m
    })
  }
  async function clear() {
    return store.clear()
  }
  async function save() {
    return store.save()
  }
  async function addMediaLibrary() {
    const paths = await open({
      multiple: true,
      filters: [
        {
          name: '音频文件',
          extensions: ['mp3'],
        },
      ],
    })

    if (!paths || paths.length === 0)
      return

    const widthFilter = await Promise.all(paths.map(async (m) => {
      return {
        path: m,
        has: await has(m),
      }
    }))

    const widthUnit8Array = await Promise.all(widthFilter.filter(f => !f.has).map(async (m) => {
      return {
        path: m.path,
        unit8Array: await readFile(m.path),
      }
    }))

    const widthTags = await Promise.all(widthUnit8Array.map(async (m) => {
      const tag = await parseBuffer(m.unit8Array)
      const picture = tag.common.picture ? tag.common.picture[0] : undefined
      return {
        path: m.path,
        name: await basename(m.path),
        createAt: Date.now(),
        size: m.unit8Array.length,
        tag: {
          album: tag.common.album,
          albumartist: tag.common.albumartist,
          artist: tag.common.artist,
          artists: tag.common.artists,
          title: tag.common.title,
          year: tag.common.year,
          bitrate: tag.format.bitrate,
          duration: tag.format.duration,
          sampleRate: tag.format.sampleRate,
          picture,
        } as MediaLibrary['tag'],
      }
    }))

    for (const item of widthTags) {
      await set(item.path, item)
    }
  }
  async function removeMediaLibrary(key: string) {
    return store.delete(key)
  }
  return {
    store,
    has,
    set,
    get,
    getAll,
    clear,
    save,
    addMediaLibrary,
    removeMediaLibrary,
  }
}
