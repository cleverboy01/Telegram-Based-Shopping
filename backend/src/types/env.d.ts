interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // متغیرهای محیطی دیگر را در اینجا اضافه کن
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
