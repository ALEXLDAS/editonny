[English — documentación principal](README.md) · [Português](README.pt-BR.md) · **Español**

<a id="top"></a>

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/hero-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/hero-still.svg" />
    <img src="docs/assets/readme/hero.svg" alt="editonny: un estudio editorial de vídeo local, con una timeline animada de vídeo, voz y escenas visuales." width="1600" />
  </picture>
</p>

# editonny

**Tu historia. Tu ritmo. Un flujo completo de edición local.**

Edición local de vídeo mediante conversación. Una skill reúne transcripción, cortes precisos, subtítulos, encuadre, audio y **145 escenas visuales** para **Codex** y **Claude Code**.

El proyecto, los comandos, la interfaz, los archivos y los prompts utilizan inglés. Este README traduce la presentación principal. La voz de tus vídeos puede conservar su idioma original.

[Empezar a editar](#instalar) · [Ver las animaciones](#motion) · [Explorar la guía](#abrir-la-guía) · [Historial de estrellas](#community)

<p align="center">
  <a href="https://github.com/soumatheusgomes/editonny/stargazers"><img src="https://img.shields.io/github/stars/soumatheusgomes/editonny?style=flat&amp;label=Stars&amp;color=354935&amp;labelColor=242721" alt="GitHub stars" /></a>
  <a href="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml"><img src="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml/badge.svg?branch=main" alt="GitHub Actions verification" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-354935?labelColor=242721" alt="MIT license for first-party code" /></a>
</p>

| Escenas visuales | Ejemplos de edición | Vídeos incluidos |
| :---: | :---: | :---: |
| **145** formas de explicar | **54** puntos de partida | **79** clips originales |

## Empieza con una solicitud

Instala la skill, abre tu agente en la carpeta de los vídeos y describe la edición. Tú diriges el resultado; editonny reúne herramientas locales y biblioteca visual.

```text
$editonny
Edit a 45-second vertical video from /path/to/footage.
Keep complete takes, clean pauses, breaths, and mistakes, and add clear captions.
Use visual scenes only where they explain the story.
Verify an 8–15 second sample before finishing the export.
```

## Instalar

Prepara Python **3.9+** para el launcher, **uv**, **FFmpeg/ffprobe**, **Node.js 22.13+ o 24+** y un agente configurado. El motor requiere Python **>=3.10,<3.14**, seleccionado por uv. Las herramientas deben estar en el `PATH`.

```sh
git clone https://github.com/soumatheusgomes/editonny.git
cd editonny
python3 install.py --target both
python3 ~/.local/share/editonny/scripts/editonny.py doctor
python3 ~/.local/share/editonny/scripts/editonny.py media status
```

Reinicia el agente. Usa **`$editonny` en Codex** o **`/editonny` en Claude Code**. Para un solo agente, utiliza `--target codex` o `--target claude`. Una copia compartida reside en `~/.local/share/editonny`, con registros mediante enlaces.

El primer uso puede descargar dependencias, modelos de transcripción o el navegador de renderizado. La transcripción y el renderizado locales no requieren una clave API de LLM; la suscripción de tu agente es independiente. Los generadores externos son opcionales y necesitan autorización antes de generar costes o transmitir archivos.

Consulta [instalación y recuperación en inglés](docs/installation.md) para detalles, instalaciones aisladas, actualizaciones y carga como plugin.

## Abrir la guía

Abre [web/index.html](web/index.html) en el navegador, conservando la carpeta `web/` completa. No necesitas instalar dependencias para explorarla.

Alternativamente, desde la raíz del repositorio:

```sh
python3 editonny.py guide
```

Abre `http://127.0.0.1:4173`; detén el servidor con `Ctrl+C`. Usa `--port 0 --no-open` para elegir un puerto disponible sin abrir el navegador.

<a id="motion"></a>

## Palabras, ideas y objetos en movimiento

Tres escenas reales de la biblioteca incluida. Los fragmentos son silenciosos y recortados, con texto sintético y contenido ilustrativo. Son ejemplos, no vídeos de clientes.

<p align="center">
  <a href="docs/assets/readme/captions.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/captions-still.png" />
    <img src="docs/assets/readme/captions.gif" alt="Subtítulos cromáticos sincronizados revelan “Your story. Your rhythm.”" width="260" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/explain.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/explain-still.png" />
    <img src="docs/assets/readme/explain.gif" alt="Un edificio ilustrativo crece planta por planta junto a un contador." width="260" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/motion.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/motion-still.png" />
    <img src="docs/assets/readme/motion.gif" alt="Planetas orbitan un Sol en rotación en la escena del sistema solar." width="260" loading="lazy" />
  </picture>
  </a>
</p>

[Subtítulos sincronizados](skills/editonny/visuals/scenes/text-chromatic.html) · [Explicaciones visuales](skills/editonny/visuals/scenes/building-panel.html) · [Movimiento espacial](skills/editonny/visuals/scenes/solar-system.html)

Las vistas previas se reproducen una vez durante 4,5 segundos. La preferencia de movimiento reducido selecciona imágenes estáticas. Abre una vista previa para reproducirla de nuevo.

## Qué hace

Describe el resultado e indica la carpeta de los vídeos. La skill guía al agente para examinar las grabaciones, seleccionar tomas completas, medir cortes con la forma de onda, preparar un proyecto, revisar una muestra y exportar un MP4 verificado.

La limpieza predeterminada elimina pausas innecesarias, respiraciones audibles, errores, falsos comienzos y repeticiones redundantes. Conserva palabras completas, ritmo natural, pausas intencionales y significado. Las revisiones puntuales respetan el intervalo solicitado. Los originales se conservan.

La guía incluye **54 ejemplos de edición**, un generador de prompts y el catálogo de escenas. Todos los prompts de edición incorporan la política de limpieza. La guía no recibe archivos ni edita vídeos en el navegador.

## Flujo de edición

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/workflow-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/workflow-still.svg" />
    <img src="docs/assets/readme/workflow.svg" alt="Flujo de edición local: describe tu intención, edita los vídeos, revisa una muestra de 8–15 segundos y exporta un MP4 verificado." width="1600" />
  </picture>
</p>

1. Elige una intención en la guía, indica la carpeta y copia la solicitud al agente.
2. La skill comprueba el entorno, analiza la voz, selecciona tomas y aplica la limpieza medida.
3. Revisa una muestra representativa de **8–15 segundos**, con voz, subtítulos y movimiento. Pide explícitamente que el agente espere si quieres aprobarla antes de continuar.
4. Completa el proyecto, renderiza con su versión fija de HyperFrames y comprueba el MP4 final.

Mantén vídeos, proyectos y bibliotecas personales fuera de la skill. Sustituye números, ofertas, marcas y testimonios de demostración por datos proporcionados. Las imágenes generadas no son pruebas.

## Estructura

| Ruta | Responsabilidad |
|---|---|
| `skills/editonny/` | Skill única y CLI |
| `skills/editonny/engine/` | Procesamiento local, preview y plantilla de proyecto |
| `skills/editonny/visuals/` | Escenas, catálogo, medios incluidos y recetas |
| `web/` | Guía independiente y biblioteca de prompts |
| `docs/` | Referencias técnicas canónicas en inglés |
| `scripts/`, `tests/` | Paquetes, verificaciones de renderizado y pruebas |

Los proyectos nuevos utilizan `project.json`, campos, comandos e identificadores en inglés. Los formatos experimentales anteriores no están soportados.

<details>
<summary><strong>Desarrollo, verificación y distribución</strong></summary>

## Desarrollar y validar

```sh
npm ci --ignore-scripts
uv sync --locked --directory skills/editonny/engine
npm run build
npm run check
python3 editonny.py doctor
npm run test:engine
npm run test:browser
npm run test:preview
npm run test:scenes
python3 scripts/smoke_engine.py
```

Las pruebas de navegador necesitan `agent-browser` y su navegador. El renderizado requiere FFmpeg y puede necesitar red en el primer uso. Inspecciona las muestras antes de eliminar temporales de `.work/`. [Resultados y limitaciones](docs/validation.md).

Edita los módulos `.mjs`; `npm run build` genera `web/app.js` y `web/catalog.json`. No edites el bundle manualmente. `npm run check:web` detecta artefactos desactualizados.

## Empaquetar

```sh
python3 scripts/package.py
```

Genera ZIPs separados para sitio y plugin, con SHA-256, en `dist/`. El plugin contiene la guía, la documentación técnica, la skill completa y **79 vídeos incluidos**. Cada edición recibe solo los clips utilizados. El sitio contiene únicamente la guía pública. Crear paquetes no publica nada ni modifica la instalación global.

</details>

<a id="community"></a>

## Sigue la historia

Si editonny ayuda con tu próximo vídeo, deja una estrella en el proyecto. Sigue su evolución, informa de un problema o sugiere una escena.

<a href="https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date&amp;theme=dark" />
    <img src="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date" alt="Star history for soumatheusgomes/editonny" width="1000" loading="lazy" />
  </picture>
</a>

[Dar una estrella](https://github.com/soumatheusgomes/editonny/stargazers) · [Informar de un problema](https://github.com/soumatheusgomes/editonny/issues) · [Abrir historial de estrellas](https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&type=date)

El gráfico actualizado lo proporciona [Star History](https://www.star-history.com/blog/how-to-use-github-star-history/) y depende de ese servicio. La insignia inicial muestra el número real de estrellas en GitHub.

## Autor y contacto

Creado y mantenido por **Matheus Gomes**.

- Instagram: [@matheusgomes](https://instagram.com/matheusgomes)
- Email: [eu@matheusgom.es](mailto:eu@matheusgom.es)
- GitHub: [soumatheusgomes/editonny](https://github.com/soumatheusgomes/editonny)

## Licencia

El código y la documentación propios usan la [licencia MIT](LICENSE.md). Las bibliotecas, modelos, fuentes, audio y medios de terceros conservan sus licencias y atribuciones; MIT no sustituye sus condiciones. Consulta los [avisos de terceros](skills/editonny/engine/THIRD_PARTY_NOTICES.md) y los avisos junto a los recursos antes de redistribuir.

[Producto](PRODUCT.md) · [Arquitectura](docs/architecture.md) · [Interfaz](docs/design.md) · [Integraciones](docs/integrations.md) · [Entorno de desarrollo](docs/setup.md)

<p align="center"><strong>YOUR STORY. ITS OWN RHYTHM.</strong><br /><a href="#top">Volver al inicio ↑</a></p>
