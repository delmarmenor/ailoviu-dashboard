# AILOVIU · Arquitectura completa del sistema de audiencias

Este repositorio solo contiene el **dashboard web**. Los datos los genera un **Google Apps Script** que vive dentro de la hoja de cálculo y que **no está en este repositorio**. Este documento describe las dos partes y cómo se conectan.

## Flujo de datos

```
Gmail (audiencias@7tvregiondemurcia.es)
  │  PDF diario "…ailoviu….pdf" (el mismo correo trae informes de otros programas)
  ▼
Apps Script · importarDiario()  ── disparador diario por la mañana
  │  1. OCR del PDF → share, audiencia, demografía…   (columnas A–U)
  │  2. Busca la carpeta del programa en Drive por fecha → Nº PROGRAMA (V) y PÚBLICO (W)
  ▼
Google Sheet "AILOVIU"  ── fórmula en AA (TIPO): con Nº PROGRAMA → ORIGINAL, vacío → REPETIDO
  │  Publicado en la web como CSV
  ▼
Dashboard (index.html en Vercel)  ── filtro por defecto "Originales" = AA == "ORIGINAL"
```

## 1. Dashboard web (este repositorio)

| Archivo | Función |
|---|---|
| `index.html` | Toda la app: lee el CSV publicado, lo procesa (`proc`), filtra (`applyFilters`) y pinta KPIs y gráficos (Chart.js). |
| `api/data.js` | Endpoint de Vercel que devuelve el CSV en JSON. El `index.html` actual **no lo usa** (lee el CSV directamente). |
| `.agent/workflows/despliegue.md` | Pasos de despliegue: un push a `main` despliega en Vercel. |

- Temporadas: empiezan en septiembre (`ssn()`): T1 = 22/23 … T5 = 26/27.
- El filtro "Originales" depende **solo** de la columna AA (TIPO) de la hoja. Si una emisión no aparece, casi siempre es porque le falta el Nº PROGRAMA en la hoja, no por el dashboard.
- Por decisión del usuario, el dashboard no usa IA.

## 2. Hoja de cálculo

- ID: `1ox1ebn2pQs-kc4N3TZe8spsiDjywiiAtV2wAI4FbSiU`, pestaña **AILOVIU**.
- Columnas clave:

| Col | Cabecera | Quién la rellena |
|---|---|---|
| A–U | PROGRAMA … MURCIA CONECTA | Script (datos del PDF) |
| V | Nº PROGRAMA (`5x04`) | Script (nombre de la carpeta de Drive) |
| W | PUBLICO | Script (celda I3 de la escaleta) — **roto en T5**, ver pendientes |
| X, Y | EMISIÓN, ESTADISTICAS | Antiguas, el script ya no las escribe |
| AA | TIPO | **Fórmula de la hoja**: ORIGINAL si V tiene valor, si no REPETIDO |
| AB, AC | EST_CALCU, Nº ABSOLUTO | Fórmulas/manual |

- Una fila por emisión de AILOVIU (franja de tarde, ~15:30). Los días sin carpeta de programa (festivos, verano) son repeticiones.

## 3. Apps Script (vinculado a la hoja)

- Script ID: `1YQlmjcjE1EU_Nhs7qCci59jvJzQ8gBENLufl1YiH_40fgPEieuU-DviF`, cuenta `realizacion@populartvrm.com`.
- Abrir: hoja → Extensiones → Apps Script.
- Usa el servicio avanzado **Drive v3**.

### Archivos que importan

| Archivo | Qué hace |
|---|---|
| `Código` | **Importador diario.** `importarDiario_core()`: limpieza única → busca PDF en Gmail → OCR → inserta fila → rellena V/W desde Drive → reintenta V/W de filas recientes vacías. |
| `core` | Redefine `importarDiario()` (es la que ejecuta el disparador) y solo llama a `importarDiario_core()` de `Código`. Su enriquecimiento propio está comentado. |
| `Dashboard` + `DashboardUI` | Dashboard antiguo como web app de Apps Script (`doGet`, `?mode=data` devuelve JSON). |
| `traer pgm` | `construirCatalogoProgramas()`: catálogo de programas desde las escaletas (T1–T4). |
| `Sin título*`, `t1`, `t2`, `ds`, `lo`, `debug`, `catalogoT1_*`… | Scripts sueltos de una sola vez (catálogos históricos, reparaciones). **No los usa la importación diaria.** |

⚠️ Hay funciones con el mismo nombre en varios archivos (`importarDiario`, `findEscaletaSheetInFolder_`, `safeOpenSpreadsheetById_`, `driveListAll_`, `toDate_`…). En Apps Script gana **la última que se carga**. Hoy son compatibles, pero hay que tenerlo en cuenta al tocar cualquiera.

### Configuración en `Código`

| Constante | Valor / uso |
|---|---|
| `GMAIL_QUERY` | Correos de `audiencias@7tvregiondemurcia.es` de los últimos 10 días con PDF "ailoviu". |
| `MAX_PDFS_PER_RUN` | 3 PDF insertados por ejecución (límite de OCR de Drive). |
| `SEASON_ROOT_FOLDERS` | **Carpeta raíz de cada temporada.** T4 `1-P8n_CBukH4lHezZ2juKYFZwWFAUOEEb`, T5 `1eDVyEgatr4x5fX4NBoLSgo8Ozb-8iR_3` ("2026-2027 5ª TEMPORADA"). |
| `DIAS_REVISION_PROG` | 60: en cada ejecución reintenta V/W de las filas de los últimos 60 días que estén vacías. |
| `RECUPERACION_DESDE` / `RECUPERACION_PROP` | Recuperación única desde el 25/09/26. Se da por terminada en cuanto una ejecución inserta menos de 3 PDF. |

### Carpetas de programa en Drive

- Nombre: `PGM_<temporada>X<número> DDMMYY`, por ejemplo `PGM_5X001 280926` → `5x01`.
- Se buscan **por día y mes** dentro de la carpeta de la temporada. Así toleran años mal escritos (p. ej. `PGM_5X024 301029`).
- Dentro está la escaleta (hoja de cálculo); el público se lee de la celda `I3`.

### Mantenimiento

- **Al empezar cada temporada:** añadir su carpeta raíz a `SEASON_ROOT_FOLDERS`. Si falta, el registro muestra `⚠️ Falta la carpeta de la T<n>`.
- **Si una emisión no aparece en el dashboard:** mirar el registro de ejecuciones del script. Los PDF que no se pueden leer dejan una línea `⚠️ PDF descartado` con el motivo y el principio del texto.
- **Para subir cambios desde fuera** (clasp / Script API): subir el proyecto completo. Hay un archivo cuyo nombre es código (`function resolverIdsTemporada2() …`) que `clasp clone` no puede descargar; un `clasp push` normal lo borraría.

## Registro de cambios

### 19/10/2026 — Las emisiones de la T5 no aparecían

**Síntoma:** desde el inicio de la 5ª temporada no aparecía ninguna emisión con el filtro "Originales".

**Causas:**
1. El importador solo buscaba carpetas de la T4 (`PGM_4`, carpeta raíz de la T4). Las de la T5 nunca se encontraban → V vacío → TIPO = REPETIDO.
2. El lector de fechas del PDF solo aceptaba meses de 3 letras (`01 OCT 2026`). Los informes de septiembre se descartaban sin avisar, así que faltaban el 28, 29 y 30/09.
3. Mirar solo 4 días de correo y meter 1 PDF por ejecución hacía que los PDF acumulados se perdieran.

**Cambios en `Código`:**
- Mapa de carpetas por temporada (`SEASON_ROOT_FOLDERS`); la temporada y el número (`5x04`) se calculan a partir de la fecha.
- Búsqueda de carpetas por DDMM; reintento de V/W de los últimos 60 días en cada ejecución.
- Fechas del PDF: también `28 SEPT 2026`, `28 SEP. 2026`, `28 DE SEPTIEMBRE DE 2026`.
- Ventana de Gmail de 10 días, 3 PDF por ejecución, recuperación única desde el 25/09.
- Registro `⚠️ PDF descartado` para cada PDF que no se puede leer.
- Eliminada una búsqueda en Drive que se repetía por cada fila insertada.
- Limpieza única de 2 filas de otro programa (24/09 21:01 y 28/09 20:58) que entraron mientras el filtro miraba también el asunto del correo. Ese filtro se volvió a dejar solo por nombre de adjunto.

**Validación:** la lógica nueva da los mismos Nº PROGRAMA que ya había en las 245 filas de la T4. Resultado: T26/27 con 16 emisiones, 14 originales (`5x01`–`5x14`), sin días duplicados.

## Pendientes

- **PUBLICO (W) vacío en toda la T5:** se cambió el formato de las escaletas y el público ya no está en `I3`. Hay que ajustar `PUBLIC_CELL` o la lectura de la escaleta en `Código`.
- Renombrar las carpetas `PGM_5X024`–`PGM_5X029`, que tienen el año mal escrito (`…1029` / `…1129`). El script ya las encuentra, pero conviene corregirlas.
- Opcional: limpiar los scripts sueltos y los nombres de función duplicados del proyecto de Apps Script.
