# Arquitectura y comportamiento

## Responsabilidades

| Archivo | Función |
| --- | --- |
| `index.js` | Registrar la aplicación nativa mediante `AppRegistry` |
| `App.tsx` | Instalar `Provider` y `SafeAreaProvider`, recuperar datos y mostrar carga o reintento antes de navegar |
| `src/auth/session.ts` | Crear tokens con aleatoriedad nativa y validar el formato de una sesión recuperada |
| `src/types/session.ts` | Definir el contrato `{user: 'alumno', token: string}` |
| `src/types/task.ts` | Definir `id`, `title`, `description` y `completed` |
| `src/store/index.ts` | Configurar Redux, hidratar el estado una sola vez y encolar escrituras |
| `src/store/hooks.ts` | Exportar hooks de dispatch y selección tipados |
| `src/store/authSlice.ts` | Iniciar, restaurar y cerrar sesión |
| `src/store/tasksSlice.ts` | Crear, alternar, eliminar y restaurar tareas |
| `src/storage/localStorage.ts` | Leer, validar, migrar y guardar datos con AsyncStorage |
| `src/navigation/types.ts` | Definir las rutas y sus parámetros |
| `src/navigation/AppNavigator.tsx` | Mostrar Login o el grupo autenticado según Redux |
| `src/screens/LoginScreen.tsx` | Validar credenciales locales, ocultar contraseña y mostrar errores |
| `src/screens/HomeScreen.tsx` | Abrir tareas, abrir perfil y cerrar sesión |
| `src/screens/TasksScreen.tsx` | Formulario, lista, búsqueda, filtros y callbacks hacia los hijos |
| `src/components/TaskItem.tsx` | Mostrar datos recibidos por props y devolver el ID en callbacks |
| `src/screens/TaskDetailScreen.tsx` | Buscar en Redux por el ID recibido y manejar tareas inexistentes |
| `src/screens/ProfileScreen.tsx` | Leer el usuario directamente desde Redux |
| `src/styles.ts` | Definir los estilos compartidos con `StyleSheet` |

## Configuración del proyecto

La configuración del proyecto se distribuye así:

| Archivo | Responsabilidad |
| --- | --- |
| `package.json` y `package-lock.json` | Dependencias, scripts, rango de Node y versiones instaladas reproducibles |
| `app.json` | Nombre registrado de la aplicación |
| `tsconfig.json` | Configuración TypeScript de React Native |
| `babel.config.js` | Transformación mediante el preset oficial de React Native |
| `metro.config.js` | Resolución y generación del paquete JavaScript |
| `.eslintrc.js` y `.prettierrc.js` | Reglas de revisión y formato |
| `jest.config.js` y `jest.setup.js` | Preset React Native, transformación de dependencias y sustitutos nativos limitados a pruebas |
| `android/settings.gradle` | Inclusión del plugin y autolinking de dependencias nativas |
| `android/build.gradle` | SDK, herramientas, Kotlin y NDK |
| `android/app/build.gradle` | Identificador de aplicación, tipos de compilación y dependencias Android |
| `android/gradle.properties` | Hermes y arquitectura nativa |
| `android/app/src/main/AndroidManifest.xml` | Actividad de entrada, teclado y configuración de navegación atrás |
| `android/app/src/main/res/values/styles.xml` | Tema Android claro y colores del sistema |

Los principales paquetes de ejecución son React y React Native para la interfaz, Redux Toolkit y React Redux para estado, React Navigation Native Stack y screens para navegación, safe-area-context para bordes, AsyncStorage para datos locales y get-random-values para el token. Las versiones exactas están fijadas por el archivo de bloqueo.

## Flujo de arranque

1. `AppContent` solicita `initializeStore` y muestra un indicador de carga.
2. Se leen en paralelo la sesión y las tareas del dispositivo.
3. Se valida la estructura de las tareas y la sesión. No se muestran pantallas antes de finalizar esta lectura.
4. Una sesión antigua que contiene `"alumno"` recibe un token nuevo y se migra. Una sesión inválida se elimina sin borrar tareas.
5. Se despacha `setTasks` y, si hay sesión válida, `restoreSession`.
6. Se registra la suscripción de guardado después de hidratar Redux. Esto impide que los valores iniciales vacíos sobrescriban los datos guardados.
7. El navegador muestra Home si la sesión está activa, o Login si no lo está.

La inicialización comparte una promesa para evitar lecturas o suscripciones duplicadas. Si falla, se libera esa promesa para permitir un reintento. Los errores de lectura o tareas corruptas bloquean la navegación y muestran Reintentar.

## Sesión

Estado inicial de `authSlice`:

```json
{"user": null, "token": null, "isAuthenticated": false}
```

`LoginScreen` comprueba `alumno` / `1234`. El callback `prepare` de `login` crea la sesión antes de ejecutar el reducer, de modo que el reducer únicamente aplica el payload. La contraseña permanece en el estado local del campo y se limpia al iniciar sesión; nunca se envía a Redux ni a AsyncStorage.

Ejemplo del estado autenticado, donde el token mostrado es solamente ilustrativo:

```json
{
  "user": "alumno",
  "token": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "isAuthenticated": true
}
```

`restoreSession` recupera el token existente sin generar otro. `logout` restablece todos los campos y la suscripción elimina la clave de sesión. La navegación reacciona al estado: no se necesita un `navigate('Login')` manual ni queda una pantalla autenticada accesible al pulsar atrás después de salir.

La validación del token comprueba su estructura, no una firma ni una autorización externa. Las credenciales están en el cliente porque la actividad pide autenticación académica local. Editar datos en un dispositivo comprometido queda fuera de esta garantía.

## Formato de almacenamiento

| Clave | Contenido |
| --- | --- |
| `@actividades/session` | JSON con `user` y `token`; la clave se elimina al cerrar sesión |
| `@actividades/tasks` | Array JSON con todas las tareas |

La bandera `isAuthenticated` se deriva al recuperar una sesión válida y no se duplica en disco. No se guardan búsqueda, filtro, contraseñas ni estado del navegador.

Ejemplo de tarea:

```json
{
  "id": "identificador-local-unico",
  "title": "Estudiar Redux",
  "description": "Repasar acciones y reducers",
  "completed": false
}
```

`nanoid` de Redux Toolkit genera los identificadores de tareas. El título y la descripción se recortan al crear la tarea. La pantalla y el reducer impiden añadir títulos vacíos. La descripción puede estar vacía.

## Sincronización y errores

Redux es la fuente de verdad durante el uso. Cada cambio de sesión o tareas añade una escritura del estado completo a una cola de promesas. Las escrituras se ejecutan en orden, evitando que un guardado lento anterior sustituya a un estado posterior.

Una sesión activa se guarda junto con las tareas mediante `multiSet`. Al cerrar sesión se elimina primero su clave y después se guardan las tareas. AsyncStorage no ofrece una transacción con rollback entre estas operaciones; un fallo puede producir una escritura parcial y se informa mediante una alerta.

Si falla una escritura, la cola captura el error, mantiene Redux en memoria y permite que el siguiente cambio intente guardar una instantánea completa. Cerrar o terminar el proceso antes de que finalice una escritura asíncrona puede perder ese último cambio. No se promete persistencia cuando el almacenamiento informa un error.

Los datos de tareas se validan por sus campos y por la ausencia de IDs duplicados. Una colección inválida no se sustituye automáticamente por una vacía. Una sesión inválida sí se descarta para permitir un nuevo login conservando las tareas válidas.

Las tareas son locales al dispositivo y se conservan al salir. La aplicación tiene un único usuario académico, por lo que no hay listas de tareas separadas por cuenta.

## Navegación y comunicación

| Ruta | Parámetros | Acceso |
| --- | --- | --- |
| Login | Ninguno | Sin sesión |
| Home | Ninguno | Con sesión |
| Tasks | Ninguno | Con sesión |
| TaskDetail | `{taskId: string}` | Con sesión |
| Profile | Ninguno | Con sesión |

Se utiliza `createNativeStackNavigator` con transiciones desactivadas. Las pantallas usan `ScreenProps` derivado de `RootStackParamList`.

`TasksScreen` pasa `id`, `title`, `completed`, `onToggle`, `onDelete` y `onOpenDetail` a `TaskItem`. El hijo invoca cada callback con el ID. El padre decide si despacha una acción o navega. El detalle recibe solamente el ID y consulta la tarea actual en Redux, evitando copias desactualizadas en parámetros.

## Filtros

`TasksScreen` mantiene `search`, `filter` y `filteredTasks` con `useState`. Un `useEffect` depende de las tareas Redux, la búsqueda y el estado seleccionado. La coincidencia por título ignora mayúsculas y minúsculas; la búsqueda se combina con el estado. No se usa `useMemo` para sustituir esta actividad. Sin coincidencias aparece `No se encontraron tareas`.

## Componentes y Android

Los controles de las pantallas provienen de `react-native`: `View`, `Text`, `TextInput`, `Pressable`, `FlatList`, `ScrollView`, `ActivityIndicator` y `Alert`. El diseño utiliza `StyleSheet`, colores simples y tipografía del sistema. No hay HTML, WebView, Tailwind, bibliotecas visuales ni Expo.

React Navigation Native Stack, `react-native-screens`, `react-native-safe-area-context`, AsyncStorage y el generador aleatorio aportan integración nativa. `SafeAreaProvider` y sus insets evitan invadir los bordes del sistema; el encabezado gestiona el borde superior. `MainActivity` configura la restauración de fragments de screens y el manifiesto desactiva predictive back para la navegación configurada. La aplicación utiliza tema claro.

## Correspondencia con las siete actividades

| Actividad | Implementación |
| --- | --- |
| 1. Login básico | Credenciales locales, contraseña oculta y error en `LoginScreen` |
| 2. Redux de sesión | `authSlice`, store, Provider, restauración local y token |
| 3. Navegación | Cinco pantallas y grupo condicionado por autenticación |
| 4. Padre e hijo | Props y callbacks entre `TasksScreen` y `TaskItem` |
| 5. Parámetros | `taskId` tipado hacia `TaskDetailScreen` y consulta Redux |
| 6. Tasklist Redux | Acciones `addTask`, `toggleTask`, `deleteTask`, `setTasks` y `FlatList` |
| 7. Filtrado con efecto | Tres estados locales y `useEffect` con sus tres dependencias |
