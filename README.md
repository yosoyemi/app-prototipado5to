# Actividades React Native

Aplicación Android con React Native CLI, TypeScript, Redux Toolkit y almacenamiento local.

Requisitos: Node 24.3 o posterior de la rama 24, JDK 17, Android SDK Platform 37, Build Tools 37.0.0, NDK 27.1.12297006 y un emulador o dispositivo Android con API 24 o posterior. Configura ANDROID_HOME y agrega platform-tools al PATH.

```powershell
npm ci
npm start
```

En otra terminal, desde este directorio:

```powershell
npm run android
```

Credenciales locales: `alumno` / `1234`.

Verificación: `npm run typecheck`, `npm run lint` y `npm test -- --runInBand`.
