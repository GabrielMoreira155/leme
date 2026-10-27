import type { ConfigContext, ExpoConfig } from 'expo/config';

// Base do app.json. Para publicar no GitHub Pages (https://<usuario>.github.io/leme/),
// a build web precisa do caminho base. Localmente fica vazio e nada muda.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  experiments: {
    ...config.experiments,
    baseUrl: process.env.EXPO_BASE_URL || undefined,
  },
});
