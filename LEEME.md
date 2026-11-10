# Carta digital Nápoles Pizza

## Archivos
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La carta que ven los clientes (pedido por WhatsApp y botón para descargar el PDF). |
| `admin.html` | El panel para editar productos, precios, fotos, agotados, sedes y horario. |
| `firebase-config.js` | Aquí se pega la configuración de Firebase (la misma del aplicativo de cierre). |
| `comun.js` | Funciones que usan las dos páginas. No hay que tocarlo. |
| `datos-ejemplo.js` | Carta de ejemplo. Solo se usa mientras no se haya guardado nada desde el panel. |
| `reglas-firestore.txt` | Las reglas de permisos que se agregan en Firebase. |

## Publicar (igual que el aplicativo de cierre)

1. **Crear el repositorio en GitHub**
   - Entra a github.com y toca **New repository**.
   - Nombre: `carta-napoles`. Márcalo como **Public**.
   - Toca **Create repository**.
2. **Subir los archivos**
   - En el repositorio nuevo toca **uploading an existing file**.
   - Arrastra todos los archivos de esta carpeta y toca **Commit changes**.
3. **Activar la página**
   - Ve a **Settings → Pages**.
   - En *Branch* elige **main** y la carpeta **/ (root)**, y toca **Save**.
   - En 1 o 2 minutos queda en `https://TU-USUARIO.github.io/carta-napoles/`.
4. **Conectar con Firebase**
   - En Firebase, abre el **mismo proyecto** del aplicativo.
   - Ve a ⚙️ **Configuración del proyecto → Tus apps** y copia el bloque `firebaseConfig`.
   - En GitHub abre `firebase-config.js`, toca el lápiz ✏️, cambia `window.FIREBASE_CONFIG = null;` por `window.FIREBASE_CONFIG = { ...lo que copiaste... };` y guarda con **Commit changes**.
5. **Dar permisos**
   - En Firebase ve a **Firestore Database → Reglas**.
   - Pega lo que hay en `reglas-firestore.txt` dentro de las reglas actuales, sin borrar las del aplicativo.
   - Pon los correos de quienes pueden editar la carta y toca **Publicar**.
6. **Cargar la carta**
   - Abre `https://TU-USUARIO.github.io/carta-napoles/admin.html`.
   - Entra con tu correo y contraseña del aplicativo.
   - Edita productos y precios y toca **Guardar cambios**.
   - La carta pública se actualiza sola.

## Enlaces para compartir
- **Clientes, Linktree, Instagram y QR:** `https://TU-USUARIO.github.io/carta-napoles/`
- **Panel (no se comparte con clientes):** `https://TU-USUARIO.github.io/carta-napoles/admin.html`

## PDF para WhatsApp
Abre la carta en el computador y toca **📄 Descargar carta en PDF** al final de la página. En la ventana que aparece elige **Guardar como PDF** y deja activado **Gráficos de fondo** para que salgan los colores.
