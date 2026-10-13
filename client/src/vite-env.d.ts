/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUICK_LOGIN?: string;
  readonly VITE_QUICK_LOGIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
