# AILOVIU · Dashboard de Audiencias

Este es el panel interactivo de audiencias para el programa **AILOVIU** de La 7 TV (Murcia). Los datos se consumen en tiempo real directamente desde un Google Sheet publicado como CSV.

## 📊 Características
- **Gráficos Dinámicos**: Evolución de share y audiencia acumulada (usando Chart.js).
- **Filtrado Avanzado**: 
  - Por temporada.
  - Por tipo de emisión (**Columna AA - TIPO**): "Original" vs "Todos".
- **KPIs Automáticos**: Cálculo de share medio, máximos, audiencia media y comparativa con el último dato.
- **Top 10**: Listas automáticas de las mejores emisiones y los mejores meses de la historia del programa.

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

## 📝 Notas sobre los Datos
- **Fuente**: [Google Sheets - Publicado como CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vTFnGpi3GGm5Xa3FwAyU8FjId8eNWxChOjD_YwaClkIDZjIx5xeUsgSldncNaXVpQ3P0Fl1tEFj7jcS/pub?gid=0&single=true&output=csv).
- **Columna Clave**: El filtro de "Originales" se basa estrictamente en la **Columna AA (TIPO)** de la hoja de cálculo. Solo aparecerán como originales las filas que tengan el texto: `ORIGINAL`.
- **Formato**: El dashboard soporta el formato de decimales con coma (ej: `3,1`) típico de las configuraciones regionales en español de Google Sheets.
