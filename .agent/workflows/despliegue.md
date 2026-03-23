---
description: Cómo actualizar y desplegar el Dashboard de Audiencias
---

Sigue estos pasos para aplicar cambios en el dashboard y que se reflejen en Vercel.

1.  **Validar cambios**: Asegúrate de que `index.html` sea funcional y no tenga errores de sintaxis en JavaScript.
2.  **Preparar commit**:
    // turbo
    Agrega todos los archivos nuevos y modificados: `git add .`
3.  **Hacer commit**:
    // turbo
    Realiza el commit con un mensaje descriptivo: `git commit -m "Descripción de la mejora"`
4.  **Desplegar**:
    // turbo
    Sube los cambios a la rama principal: `git push origin main`
5.  **Verificar**: Espera 20 segundos y visita `https://ailoviu-dashboard.vercel.app` (o el dominio configurado).

### Notas sobre la IA
Este proyecto **NO** utiliza IA en el frontend por decisión del usuario. No intentes re-activar funciones de Claude/Anthropic sin confirmación explícita, ya que el usuario prefiere un panel puramente estadístico.
