# Verificación y pruebas

## Comandos automáticos

Ejecutar desde la raíz con una versión compatible de Node, preferentemente Node 24 LTS:

```powershell
npm run typecheck
npm run lint
npm test -- --runInBand
```

`typecheck` ejecuta TypeScript sin emitir archivos. `lint` revisa las pantallas, store, componentes, pruebas y configuración JavaScript, y falla ante advertencias. Jest ejecuta las pruebas en un único proceso con `--runInBand`.

Para verificar que Metro resuelve los imports y genera el paquete de Android:

```powershell
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output "$env:TEMP\actividades-android.jsbundle" --max-workers 2
```

Este paquete JavaScript no equivale a un APK ni demuestra ejecución de los módulos nativos en un teléfono.

## Cobertura de comportamiento

| Archivo | Comprobaciones |
| --- | --- |
| `__tests__/AppFlow.test.tsx` | Error de credenciales, login correcto, token persistido, título obligatorio, alta, cambio de estado, filtros combinados, detalle, tarea inexistente, eliminación, perfil y cierre de sesión |
| `__tests__/persistence.test.ts` | Recuperación del token y tareas sin sobrescribir la carga, orden de escrituras, cierre de sesión que conserva tareas, reintento de lectura, tareas corruptas, fallo y recuperación de escritura, migración de sesión anterior y descarte de sesiones inválidas |
| `__tests__/session.test.ts` | Formato y unicidad del token, validación de sesión, restauración del mismo token, limpieza al salir y nuevo token al volver a entrar |

Jest utiliza el mock oficial de AsyncStorage y el de áreas seguras. Para aleatoriedad usa WebCrypto de Node exclusivamente dentro de `jest.setup.js`. En Android, el generador usa la implementación de la dependencia nativa instalada. Las pruebas de navegación incluyen elementos retenidos por el stack nativo, que no dispone de una superficie Android real dentro de Jest.

## Comprobación manual en Android

La siguiente lista requiere un teléfono o emulador y una compilación nueva después de instalar el generador de tokens:

- [ ] `adb devices` muestra un dispositivo autorizado.
- [ ] `npm start` y `npm run android` abren la aplicación.
- [ ] Se muestran el formulario de login y la contraseña oculta.
- [ ] Credenciales incorrectas muestran el error.
- [ ] `alumno` / `1234` abre Inicio.
- [ ] Mi perfil muestra el usuario de Redux y Sesión activa.
- [ ] Una tarea sin título no se añade.
- [ ] Una tarea con título y descripción aparece en la lista.
- [ ] La tarea alterna entre pendiente y completada.
- [ ] Búsqueda y los tres filtros funcionan en combinación.
- [ ] Ver detalle muestra la información de la tarea seleccionada.
- [ ] Eliminar quita la tarea de la lista.
- [ ] Salir del proceso y abrir de nuevo conserva sesión y tareas; el token recuperado debe ser el mismo, comprobable con el inspector Redux sin registrarlo en logs.
- [ ] Cerrar sesión vuelve al login y elimina el token local.
- [ ] El botón Atrás de Android no recupera una pantalla autenticada después de salir.
- [ ] Un login posterior conserva las tareas y crea otro token.
- [ ] El teclado, los botones y el contenido funcionan en una pantalla pequeña y al girar el dispositivo.

Las casillas representan pasos por realizar; no afirman que estas comprobaciones físicas se hayan ejecutado.

## Entorno y limitación registrada

Durante la implementación se detectaron Node 23 del sistema y JDK 17. Las verificaciones se ejecutaron con un ejecutable de Node 24 compatible. No se encontró el SDK de Android en la ruta habitual ni `adb` en el `PATH`.

Se intentó `gradlew.bat :app:assembleDebug`. Gradle no pudo terminar la configuración de Android por `SDK location not found`. Debe instalarse el SDK y configurarse su ruta antes de compilar o ejecutar. No hay una ejecución verificada en dispositivo o emulador. La incorporación del generador aleatorio requiere una nueva compilación nativa en ese entorno.

## Resultado de esta entrega

| Comprobación | Resultado |
| --- | --- |
| TypeScript | Sin errores |
| ESLint | Sin errores ni advertencias |
| Jest | 3 suites y 11 pruebas aprobadas |
| Paquete JavaScript Android con Metro | Generado correctamente |
| Autolinking del generador aleatorio | Dependencia Android detectada por React Native CLI |
| APK y ejecución en Android | Pendientes por ausencia del SDK y dispositivo/emulador disponible |

Las pruebas automáticas se ejecutaron con Node 24. Para verificar otra máquina o una modificación posterior, ejecutar nuevamente los comandos de este documento.
