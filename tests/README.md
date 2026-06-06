# Tests

Suite de tests de API del servidor usando `node:test` (integrado en Node 18+) y `supertest`.

## Requisitos

- Node.js 18+ (se usa Node 24 en desarrollo)
- Dependencias instaladas: `npm install`

## Ejecutar

```bash
npm test
```

Los cuatro suites se ejecutan en procesos Node independientes para garantizar aislamiento completo:

| Fichero | Cubre |
|---|---|
| `local.test.js` | Smoke tests sin auth: proyectos, tableros, items, papelera básica |
| `auth.test.js` | Login, lockout, sesión, cambio de contraseña, admin, aislamiento entre usuarios |
| `share.test.js` | Tokens de compartir, acceso de invitado, tableros privados, locks de edición |
| `trash.test.js` | Ciclo completo de papelera: fotos y proyectos (borrar, restaurar, vaciar) |

Cada suite crea un directorio temporal aislado en `os.tmpdir()`. La carpeta `./data` real nunca se toca.

## Ejecutar un solo suite

```bash
node --test tests/local.test.js
```

## Añadir tests

Cada fichero de test establece `process.env.TABLEAU_AUTH` y `process.env.TABLEAU_DATA_DIR` **antes** del primer `require('../server')`, porque `AUTH_ENABLED` y `DATA_DIR` se capturan como `const` al cargar el módulo. Cualquier test nuevo que requiera auth debe seguir este patrón.

## Bugs encontrados durante la escritura de los tests

_(ninguno hasta ahora — esta lista crece con la suite)_
