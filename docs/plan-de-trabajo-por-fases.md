# Plan de Trabajo por Fases -- Implementación de la Página *Position* (Kanban) en LTI

## 📘 Objetivo General

Implementar la interfaz **position** en el proyecto LTI (ATS) dentro del
repositorio `AI4Devs-frontend-2509-rk`, siguiendo buenas prácticas de
frontend, usando **Cursor** y **Builder.io**, y y generando artefactos documentados por fase en `frontend/docs/` 


------------------------------------------------------------------------

# 📂 Estructura General del Proceso

Estructura General del Proceso

Cada fase genera sus propios artefactos para:

- análisis
- decisiones técnicas
- diseño de arquitectura
- prompts utilizados
- notas de Builder.io
- integraciones con Cursor
- validación final

Todos se guardarán en:

    frontend/docs/

Los artefactos incluyen análisis, decisiones técnicas, diseño de
arquitectura, prompts, notas de Builder.io, integración con Cursor y
checklist final.

------------------------------------------------------------------------

# 🔵 Fase 0 --- Preparación del entorno y rama

### Objetivo

Tener lista la rama de trabajo, estructura básica de documentación y
levantar el proyecto.

## Artefactos generados
```
frontend/docs/phase-0-setup.md
```


### Acciones

-   Crear rama: `git checkout -b frontend-hso`
-   Crear carpeta `frontend/docs/`
-   Crear archivo `phase-0-setup.md`
-   Instalar dependencias y ejecutar backend + frontend
-   Verificar funcionamiento de `/positions`

### Prompt recomendado (Cursor)

```
Eres un **experto en frontend con React y TypeScript**, trabajando en el proyecto LTI (ATS).  
Debes seguir estas reglas:

-   Mantén el código **simple (KISS)**, modular y fácil de mantener.  
-   Respeta la estructura actual del proyecto (`frontend/src`), reutilizando patrones, estilos y componentes existentes.
-   Prioriza **UX y accesibilidad**: diseño responsivo (mobile first), navegación clara, feedback visual en interacciones importantes.
-   Aplica **buenas prácticas de código**: tipos explícitos en TypeScript, separación de componentes, funciones puras donde tenga sentido, evitar duplicación.
-   Usa **ESLint y Prettier** implícitamente: si propones código, haz que ya cumpla las reglas estándar.
-   No hagas cambios grandes de golpe: prefiero pasos **incrementales** con explicaciones breves.
    

Contexto del ejercicio:

-   Debemos crear la página `position` tipo kanban, que se abre desde el botón “Ver proceso” de la lista de positions.
-   Esta página usará los endpoints:
    -   `GET /positions/:id/interviewFlow`
    -   `GET /positions/:id/candidates`
    -   `PUT /candidates/:id/stage`
-   Más adelante integraremos un layout generado desde Builder.io para la parte visual.
    

Siempre que te pida cambios, explícame:

1.  Qué archivos vas a tocar.
2.  Qué responsabilidad tendrá cada componente nuevo.
3.  Qué decisiones de diseño tomas y por qué.
```

------------------------------------------------------------------------

# 🔵 Fase 1 --- Entender la estructura actual del frontend

### Objetivo

Comprender cómo está organizado el frontend para poder integrar la
página `position`.

## Artefactos generados
```
frontend/docs/phase-1-analysis.md
```


### Acciones

-   Identificar router principal
-   Ubicar página de positions y el botón "Ver proceso"
-   Identificar cómo se manejan API services, estilos y componentes
-   Documentar hallazgos en `docs/phase-1-analysis.md`

### Prompt recomendado (Cursor)

```
**Agente: Explorador de código LTI**

Objetivo: Ayudarme a entender la estructura actual del frontend para integrar una página nueva.

Tarea:

1.  Revisa el contenido de `frontend/src`.
2.  Indica:
    -   Qué archivo gestiona las rutas principales.
    -   Dónde se renderiza la lista de positions (nombre del componente y archivo).
    -   En qué componente está el botón “Ver proceso” y qué hace actualmente.
3.  Dime qué patrón de organización están usando para páginas y componentes (ej: carpeta `pages`, `components`, `services`).
    

Importante:

-   No hagas cambios todavía.
-   Solo quiero un **mapa mental** de cómo está organizado el frontend, para luego decidir dónde crear la página `position`.
```
   

------------------------------------------------------------------------

# 🔵 Fase 2 --- Diseño funcional y técnico de la página *Position*

### Objetivo

Definir responsabilidades, estructura de componentes, tipos TS, y
servicios API.

## Artefactos generados
```
frontend/docs/architecture-position-page.md
frontend/docs/api-flow-analysis.md
frontend/docs/kanban-design-decisions.md
```

### Acciones

-   Crear archivo `architecture-position-page.md`
-   Diseñar estructura de componentes:
    -   `PositionPage`
    -   `KanbanBoard`
    -   `KanbanColumn`
    -   `CandidateCard`
-   Definir tipos TS para interviewFlow, interviewSteps, candidates
-   Crear firmas de servicios API
-   Definir comportamiento del kanban: carga, error, drag & drop, PUT
    update

### Prompt recomendado (Cursor)

```

**Agente: Arquitecto de la página Position (kanban)**

Objetivo: Diseñar la estructura de componentes y servicios para la página `/positions/:id` sin implementar todavía el código final.

Tareas:

1.  A partir de los endpoints:
    -   `GET /positions/:id/interviewFlow`
    -   `GET /positions/:id/candidates`
    -   `PUT /candidates/:id/stage`  
        propón:
    -   Tipos TypeScript (`InterviewStep`, `InterviewFlow`, `Candidate`, etc.).
    -   La firma de las funciones de servicio API.
        
2.  Propón una estructura de componentes React:
    -   `PositionPage`
    -   `KanbanBoard`
    -   `KanbanColumn`
    -   `CandidateCard`
        
3.  Para cada componente, dime:
    -   Qué props debe recibir.
    -   Qué responsabilidad tiene (y qué **no** debe hacer, según KISS).
        
No escribas todavía el código completo, solo las definiciones de tipos, firmas de funciones y descripción de componentes.
```


------------------------------------------------------------------------

# 🔵 Fase 3 --- Builder.io: Diseño visual del Kanban

### Objetivo

Obtener un **layout React + CSS/Tailwind** de la vista kanban, que luego integraremos con la lógica en Cursor.

## Artefactos generados
```
frontend/docs/builderio-export-notes.md
frontend/src/pages/PositionPageLayout.tsx
```


### Estrategia propuesta

1.  En Builder.io:
    -   Crear una página que represente la vista `position`:
        -   Header con flecha + título de la posición.
        -   Contenedor de columnas (kanban):
            -   Layout de columnas en horizontal para desktop.
            -   Para móvil, columnas en vertical full width.
        -   Tarjetas simples con:
            -   Nombre del candidato.
            -   Puntuación.
                
2.  No te preocupes todavía por **datos reales**, usa:
    -   Títulos de ejemplo (“Frontend Engineer”).
    -   Columnas dummy (“Initial Screening”, “Technical Interview”, etc.).
    -   Candidatos de ejemplo.
        
3.  Exportar el código:
    -   Elige output en React (idealmente con CSS/Tailwind consistente).
    -   Copia el código a un archivo provisional en tu repo, por ejemplo:
        -   `frontend/src/pages/PositionPageLayout.tsx` (solo layout).
    -   Luego, con Cursor, iremos **limpiando y adaptando** ese código a la estructura de componentes que definimos en la Fase 2.
        

### Prompt para ti (no para Cursor, sino como checklist al entrar a Builder.io)

-   Diseñar una estructura muy simple:
    -   No metas animaciones complejas ni cosas pesadas.
    -   Piensa en **Mobile First**: ¿Cómo se verá en pantalla estrecha?
-   Asegúrate de:
    -   Usar contenedores con nombres razonables (esto luego ayuda a entender el JSX).
    -   Dejar claro qué es “columna” y qué es “tarjeta”.
        

Cuando tengas el código exportado de Builder.io, me lo puedes pegar (o describir la estructura) y en la siguiente fase lo integramos.



------------------------------------------------------------------------

# 🔵 Fase 4 --- Integración Builder.io + Lógica con Cursor

### Objetivo

Separar el layout exportado en componentes y enlazarlo con datos reales.

## Artefactos generados
```
frontend/docs/integration-plan.md
```


### Acciones

-   Crear componentes reales con base en lo exportado
-   Integrar servicios API
-   Realizar refactors necesarios en Cursor
-   Documentar integración en `docs/integration-plan.md`

### Prompt recomendado (Cursor)

Aquí usaremos un agente en Cursor tipo “Refactor y ensamblador”:

```
**Agente: Integrador layout + lógica**

Objetivo: A partir del layout generado por Builder.io y de la estructura propuesta, separar la vista en:
-   `PositionPage` (datos, loading, errores).
-   `KanbanBoard`, `KanbanColumn`, `CandidateCard`.
    
Reglas:
-   Mantener el layout y estilos lo más fieles posible al diseño de Builder, pero simplificando lo que sea redundante (KISS).
-   Componentes pequeños y reutilizables.
-   Aplicar TypeScript estricto en las props.
```


------------------------------------------------------------------------

# 🔵 Fase 5 --- Implementar Drag & Drop + API PUT

### Objetivo

Permitir mover candidatos entre fases y actualizar el estado en el
backend.

## Artefactos generados
```
frontend/docs/drag-and-drop-implementation.md
```

### Acciones

-   Elegir librería drag & drop ligera
-   Implementar handleDragEnd
-   Integrar PUT `/candidates/:id/stage`
-   Manejar optimistic UI + rollback en caso de error
-   Añadir feedback visual (toast)

### Prompt recomendado (Cursor)

```
    Agente: Especialista en Drag & Drop React
    Implementa drag&drop en KanbanBoard:
    - Usa librería ligera
    - Agrega handleDragEnd
    - Llama PUT /candidates/:id/stage
    - Optimistic update
```

------------------------------------------------------------------------

# 🔵 Fase 6 --- Responsividad, UX, accesibilidad y rendimiento

### Objetivo

Aplicar buenas prácticas: mobile-first, accesibilidad básica,
simplicidad KISS.

## Artefactos generados
```
frontend/docs/responsiveness-ux.md
```

### Acciones

-   Revisar contraste, focus, aria-labels
-   Optimizar renders (memo si aplica)
-   Verificar móviles (columnas verticales)
-   Documentar mejoras en `docs/responsiveness-ux.md`

------------------------------------------------------------------------

# 🔵 Fase 7 --- Archivo final `prompts-iniciales.md`

### Objetivo

Crear un manual para AI Assistants dentro del repositorio.

## Artefactos generados
```
frontend/prompts/prompts-iniciales.md
```

### Contenido sugerido

-   Roles definidos (Architect, Integrator, Explorer)
-   Reglas utilizadas en Cursor
-   Prompts clave usados por fase
-   Buenas prácticas aplicadas

------------------------------------------------------------------------

# 🔵 Fase 8 --- QA final + Pull Request

## Objetivo
Validación completa.

## Artefactos generados
```
frontend/docs/checklist-final.md
```

### Acciones

-   Pruebas manuales completas
-   Validar movimiento de candidatos
-   Revisar responsividad en móvil
-   Crear `docs/checklist-final.md`
-   Hacer commit + push
-   Crear Pull Request desde rama `frontend-iniciales`

------------------------------------------------------------------------

# ✔️ Fin del documento

Este plan puede importarse directamente como *contexto* en Cursor y
sirve como guía completa del proyecto.
