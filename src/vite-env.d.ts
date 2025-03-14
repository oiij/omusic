/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
// 声明 vite 环境变量
declare interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_BASE: string
  readonly VITE_API_BASE_PREFIX: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEV_PORT: number
  // 更多环境变量...
}
