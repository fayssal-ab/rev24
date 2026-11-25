interface ImportMetaEnv {
  /** "on" = accounts required (Netlify + MySQL API); anything else = local mode */
  readonly VITE_AUTH?: string;
  /** API base, default "/api" (Netlify Function) */
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** id of the running build (vite.config.ts), compared with /version.json */
declare const __BUILD_ID__: string;
