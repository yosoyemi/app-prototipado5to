# Actividades React Native

Aplicación académica Android con React Native CLI, TypeScript, Redux Toolkit y componentes nativos. Implementa las siete actividades, cinco pantallas y persistencia local. No requiere servidores, cuentas externas, bases de datos remotas ni APIs.

## Preparación de Windows

| Herramienta | Versión/configuración |
| --- | --- |
| Node.js | Rama 24 LTS, desde 24.3.0; el rango exacto está en `package.json` |
| Java | JDK 17, configurar `JAVA_HOME` |
| Android Studio | Usarlo para instalar el SDK y crear un emulador |
| Android SDK Platform | 37 |
| Android SDK Build Tools | 37.0.0 |
| Android NDK | 27.1.12297006 |
| Dispositivo | Android API 24 o posterior |

Configurar `ANDROID_HOME` con la ruta real del SDK. En una instalación habitual de Windows es `%LOCALAPPDATA%\Android\Sdk`. Agregar sus carpetas `platform-tools` y `emulator` al `PATH`. No apuntar a una carpeta vacía: debe contener las herramientas instaladas desde Android Studio.

Verificar desde PowerShell:

```powershell
node --version
java -version
adb devices
```

En un teléfono físico, activar las opciones de desarrollador y la depuración USB, conectar el cable y aceptar la autorización del equipo. En un emulador, iniciar el dispositivo desde Android Studio. `adb devices` debe mostrar el dispositivo con estado `device`.

## Instalación y ejecución

Desde la raíz del proyecto, instalar las versiones registradas en el archivo de bloqueo:

```powershell
npm ci
npm start
```

Mantener Metro abierto. En otra terminal, desde la misma raíz:

```powershell
npm run android
```

Se utiliza React Native CLI; no ejecutar `expo start`. Después de añadir o cambiar una dependencia nativa, ejecutar de nuevo `npm run android` para reconstruir la aplicación.

Para compilar un APK de depuración sin instalarlo:

```powershell
cd android
.\gradlew.bat :app:assembleDebug
```

El resultado, si la compilación termina correctamente, se guarda en `android/app/build/outputs/apk/debug/app-debug.apk`. No es una compilación de distribución para una tienda.

## Uso

1. Ingresar con usuario `alumno` y contraseña `1234`. La contraseña se oculta mientras se escribe.
2. Desde Inicio, abrir Ver tareas o Mi perfil.
3. Crear una tarea con título y descripción opcional. Un título vacío o con espacios muestra un error.
4. Usar los botones de cada tarea para cambiar su estado, consultar su detalle o eliminarla.
5. Buscar por título y combinar la búsqueda con Todas, Pendientes o Completadas.
6. Regresar a Inicio y cerrar sesión. Las tareas se conservan; el token se elimina.

Las eliminaciones son inmediatas y no tienen una función de deshacer. Si una tarea deja de existir mientras su detalle está abierto, se informa y se permite regresar.

## Login y token local

Cada login correcto crea un token opaco de 32 bytes, representado con 64 caracteres hexadecimales. Se obtiene mediante `crypto.getRandomValues`, con soporte nativo de [`react-native-get-random-values`](https://github.com/LinusU/react-native-get-random-values). No se usa la contraseña para construir el token.

Redux mantiene `user`, `token` e `isAuthenticated`. AsyncStorage conserva únicamente el usuario y el token de sesión; nunca guarda la contraseña. Al reiniciar la aplicación, se recupera el mismo token. Cerrar sesión elimina la clave de sesión del dispositivo y limpia Redux. Un nuevo login genera otro token.

Este token sirve para identificar la sesión académica local. No es un JWT, no está firmado por un servidor y no verifica permisos remotos. No tiene vencimiento automático: permanece hasta cerrar sesión, borrar los datos de la aplicación o encontrar una sesión inválida. AsyncStorage no cifra estos valores; este diseño corresponde a la autenticación local solicitada.

Las sesiones de la versión anterior que guardaban solamente `"alumno"` se migran a usuario y token sin eliminar las tareas. Una sesión inválida se descarta y se vuelve al login.

## Organización

```text
App.tsx
index.js
android/
src/
  auth/session.ts
  components/TaskItem.tsx
  navigation/AppNavigator.tsx
  navigation/types.ts
  screens/LoginScreen.tsx
  screens/HomeScreen.tsx
  screens/TasksScreen.tsx
  screens/TaskDetailScreen.tsx
  screens/ProfileScreen.tsx
  store/index.ts
  store/hooks.ts
  store/authSlice.ts
  store/tasksSlice.ts
  storage/localStorage.ts
  types/task.ts
  types/session.ts
  styles.ts
__tests__/
docs/ARQUITECTURA.md
docs/VERIFICACION.md
```

## Verificaciones

```powershell
npm run typecheck
npm run lint
npm test -- --runInBand
```

Las pruebas comprueban el flujo de pantallas, las acciones Redux, los tokens y la persistencia. Los módulos nativos de almacenamiento, aleatoriedad y áreas seguras se sustituyen solamente dentro de Jest; la aplicación usa sus implementaciones nativas reales.

La arquitectura, los formatos guardados y la correspondencia con las actividades están en [ARQUITECTURA](docs/ARQUITECTURA.md). Las pruebas, la comprobación manual y las limitaciones del entorno están en [VERIFICACION](docs/VERIFICACION.md).

## Problemas habituales

| Mensaje o situación | Solución |
| --- | --- |
| `SDK location not found` | Instalar el SDK y configurar `ANDROID_HOME`, o indicar su ruta real en `android/local.properties` mediante `sdk.dir` |
| `adb` no se reconoce | Agregar `platform-tools` al `PATH` y abrir una terminal nueva |
| `unauthorized` en `adb devices` | Aceptar la autorización de depuración USB en el teléfono |
| No hay dispositivos | Abrir un emulador o conectar un teléfono autorizado |
| Error al encontrar `RNGetRandomValues` | Reinstalar dependencias y reconstruir Android; recargar Metro no instala módulos nativos |
| No se pueden recuperar datos locales | Pulsar Reintentar; comprobar espacio y almacenamiento del dispositivo. Las tareas corruptas requieren revisar los datos; no se borran automáticamente |
| No se pueden guardar cambios | Comprobar espacio disponible. Redux conserva los cambios en memoria y la siguiente modificación vuelve a intentar guardar el estado completo |
| Metro no conecta con un dispositivo USB | Comprobar `adb devices`, ejecutar `adb reverse tcp:8081 tcp:8081` y mantener `npm start` abierto |
