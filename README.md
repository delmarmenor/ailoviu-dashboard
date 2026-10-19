# AILOVIU · Dashboard de Audiencias

Este es el panel interactivo de audiencias para el programa **AILOVIU** de La 7 TV (Murcia). Los datos se consumen en tiempo real directamente desde un Google Sheet publicado como CSV.

## 📊 Características
- **Filtros**: periodo (temporada, mes en curso, últimos 10) y tipo de emisión (**Columna AA - TIPO**): "Originales" vs "Todas".
- **KPIs**: share medio, diferencia con la cadena, audiencia media, emisiones y último programa; con una temporada elegida, comparan con la anterior.
- **Evolución**: share y audiencia con media móvil de 10 emisiones (y cada emisión como punto); diferencia mensual AILOVIU − cadena.
- **Comparativa de temporadas**: temporada contra temporada por nº de emisión, resumen por temporada y originales frente a repeticiones.
- **Cuándo funciona mejor**: mapa de calor mes × día de la semana y perfil de audiencia (sexo, edad, tamaño del municipio).
- **Localidades**: ranking de share por localidad de grabación (columna PUBLICO).
- **Competencia**: AILOVIU frente a Murcia Conecta (solo emisiones con dato).
- **Rankings**: mejores y peores emisiones, mejores meses y últimas 10 emisiones.

## ⚙️ Estructura Técnica
- **index.html**: Contiene toda la lógica del frontend, estilos y motor de gráficos.
- **Parser de Datos**: Robusto procesado de CSV para manejar correctamente las comas decimales y comillas del formato de Google Sheets.
- **Backend (Vercel)**: La carpeta `/api` permite extender funcionalidades si se vuelven necesarias en el futuro.

## 🚀 Despliegue (Vercel)
Este proyecto está configurado para desplegarse automáticamente al hacer "push" en la rama `main` de GitHub.

### Repositorio
`https://github.com/delmarmenor/ailoviu-dashboard`

### Pasos para actualizar:
1. Realiza tus cambios localmente.
2. Ejecuta los comandos en tu terminal:
   ```powershell
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. Vercel detectará el cambio y actualizará la web en unos segundos.

## 🧭 Arquitectura completa
Los datos de la hoja los genera un Google Apps Script que **no está en este repositorio**. Ver [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) para el flujo Gmail → Apps Script → Sheet → dashboard, el mantenimiento por temporada y el registro de cambios.

## 📝 Notas sobre los Datos
- **Fuente**: [Google Sheets - Publicado como CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vTFnGpi3GGm5Xa3FwAyU8FjId8eNWxChOjD_YwaClkIDZjIx5xeUsgSldncNaXVpQ3P0Fl1tEFj7jcS/pub?gid=0&single=true&output=csv).
- **Columna Clave**: El filtro de "Originales" se basa estrictamente en la **Columna AA (TIPO)** de la hoja de cálculo. Solo aparecerán como originales las filas que tengan el texto: `ORIGINAL`.
- **Formato**: El dashboard soporta el formato de decimales con coma (ej: `3,1`) típico de las configuraciones regionales en español de Google Sheets.
