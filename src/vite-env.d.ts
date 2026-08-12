/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIN_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
