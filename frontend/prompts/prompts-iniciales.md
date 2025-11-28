# Prompts Iniciales - Manual para AI Assistants

## 📋 Objetivo
Este documento contiene los prompts y reglas utilizados durante el desarrollo de la página Position (Kanban) en el proyecto LTI. Sirve como referencia para futuros desarrollos con AI Assistants.

---

## 🎯 Contexto del Proyecto

**Proyecto**: LTI - Applicant Tracking System (ATS)  
**Framework**: React 18 + TypeScript  
**UI Library**: React Bootstrap 5.3.3  
**Repositorio**: AI4Devs-frontend-2509-rk
**Rama**: frontend-hso
**Modelo**: Sonnet 4.5
**IDE**: Cursor v2.1.20

---

## 🤖 Roles Definidos para AI Assistants

### 1. **Agente Explorador** (Fase 1)
**Propósito**: Analizar la estructura existente del código


```markdown
Eres un **experto en análisis de código React**.

Objetivo: Ayudarme a entender la estructura actual del frontend.

Tarea:
1. Revisa el contenido de `frontend/src`.
2. Indica:
   - Qué archivo gestiona las rutas principales
   - Dónde se renderiza la lista de positions
   - En qué componente está el botón "Ver proceso"
3. Dime qué patrón de organización usan para páginas y componentes

Importante:
- NO hagas cambios todavía
- Solo quiero un mapa mental de cómo está organizado el frontend
```

**Uso**: Antes de implementar cualquier feature nueva  
**Output esperado**: Documento de análisis con estructura de archivos

---

### 2. **Agente Arquitecto** (Fase 2)
**Propósito**: Diseñar la estructura de componentes y servicios

```markdown
Eres un **arquitecto de software especializado en React**.

Objetivo: Diseñar la estructura de componentes para la página Position (Kanban).

Tareas:
1. A partir de los endpoints del backend, propón:
   - Tipos TypeScript necesarios
   - Firmas de funciones de servicio API
   
2. Propón una estructura de componentes React:
   - PositionPage (Container)
   - KanbanBoard (Presentational)
   - KanbanColumn (Presentational)
   - CandidateCard (Presentational)
   
3. Para cada componente, define:
   - Props que debe recibir
   - Responsabilidad única (y qué NO debe hacer)
   
Reglas:
- Aplicar principio KISS (Keep It Simple, Stupid)
- Separación clara entre componentes smart y presentational
- TypeScript estricto
- No implementar todavía, solo diseñar
```

**Uso**: Diseño de features complejas  
**Output esperado**: Documento de arquitectura con diagramas y tipos

---

### 3. **Agente Implementador** (Fase 4)
**Propósito**: Implementar el código siguiendo la arquitectura

```markdown
Eres un **desarrollador senior en React y TypeScript**.

Objetivo: Implementar los componentes diseñados manteniendo buenas prácticas.

Reglas obligatorias:
1. **KISS**: Mantén el código simple, no sobre-ingenierizar
2. **Consistencia**: Usa el mismo estilo que los componentes existentes
3. **TypeScript estricto**: Todos los tipos deben estar bien definidos
4. **React Bootstrap**: Usa componentes de Bootstrap para UI
5. **Accesibilidad**: Considera navegación por teclado y screen readers
6. **Performance**: Evita re-renders innecesarios

Patrón de código:
- Componentes funcionales con hooks
- Props interface explícita
- Manejo de errores en try/catch
- Estados de loading/error/success

NO hagas:
- Componentes de clase (usar functional components)
- Inline styles complejos (usar CSS classes)
- Lógica de negocio en componentes presentacionales
- Mutación directa de estado
```

**Uso**: Implementación de features  
**Output esperado**: Código funcional y testeado

---

## 📝 Prompts Específicos Utilizados

### Prompt de Configuración Inicial (Fase 0)

```markdown
Eres un **experto en frontend con React y TypeScript**, trabajando en el proyecto LTI (ATS).  

Debes seguir estas reglas:
- Mantén el código **simple (KISS)**, modular y fácil de mantener
- Respeta la estructura actual del proyecto, reutiliza patrones existentes
- Prioriza **UX y accesibilidad**: diseño responsivo (mobile first), 
  navegación clara, feedback visual en interacciones importantes
- Aplica **buenas prácticas de código**: tipos explícitos en TypeScript, 
  separación de componentes, funciones puras, evitar duplicación
- Usa **ESLint y Prettier** implícitamente
- Prefiero pasos **incrementales** con explicaciones breves

Contexto del ejercicio:
- Debemos crear la página `position` tipo kanban
- Se abre desde el botón "Ver proceso" de la lista de positions
- Esta página usará los endpoints:
  - GET /positions/:id/interviewFlow
  - GET /positions/:id/candidates
  - PUT /candidates/:id/stage

Siempre que te pida cambios, explícame:
1. Qué archivos vas a tocar
2. Qué responsabilidad tendrá cada componente nuevo
3. Qué decisiones de diseño tomas y por qué
```

**Cuándo usar**: Al inicio de cualquier sesión de desarrollo

---

### Prompt para Análisis de APIs (Fase 2)

```markdown
Analiza los siguientes endpoints del backend y documenta:

Endpoints:
1. GET /position/:id/interviewflow
2. GET /position/:id/candidates  
3. PUT /candidates/:id

Para cada uno:
1. Request (params, query, body)
2. Response (estructura, tipos)
3. Posibles errores (404, 500, etc.)
4. Cómo se consumirá en el frontend

Genera:
- Tipos TypeScript para request/response
- Funciones de servicio con tipos
- Flujo de transformación de datos (backend → frontend)
```

**Cuándo usar**: Al integrar con nuevos endpoints

---

### Prompt para Componentes Presentacionales

-```markdown
Crea un componente presentacional siguiendo este template:

+```typescript
interface [ComponentName]Props {
  // Props con tipos explícitos
}

const [ComponentName]: React.FC<[ComponentName]Props> = ({ 
  // Destructure props
}) => {
  // NO estado local si es presentacional puro
  // Solo renderizado basado en props
  
  return (
    // JSX usando React Bootstrap
  );
};

export default [ComponentName];
```

Requisitos:
- Props interface explícita
- Tipos estrictos de TypeScript
- Componentes de React Bootstrap
- Sin lógica de negocio
- Sin llamadas API
- Sin manejo de estado global
```

**Cuándo usar**: Al crear componentes de UI puros

---

### Prompt para Componentes Container

-```markdown
Crea un componente container (smart component) siguiendo este patrón:

+```typescript
const [ComponentName]: React.FC = () => {
  // 1. Hooks de routing (useParams, useNavigate)
  const { id } = useParams<{ id: string }>();
  
  // 2. Estado local
  const [state, setState] = useState<StateType>({...});
  
  // 3. Effects para carga de datos
  useEffect(() => {
    loadData();
  }, [id]);
  
  // 4. Funciones de manejo de eventos
  const handleAction = async () => {
    try {
      // Optimistic update si aplica
      setState(prev => ({...}));
      
      // API call
      await apiCall();
      
      // Success handling
    } catch (error) {
      // Error handling + rollback
    }
  };
  
  // 5. Renderizado condicional (loading, error, success)
  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorMessage />;
  
  // 6. Renderizado principal
  return (
    <Container>
      <PresentationalComponents 
        data={state.data}
        onAction={handleAction}
      />
    </Container>
  );
};
```

Responsabilidades:
- ✅ Manejo de estado
- ✅ Llamadas API
- ✅ Lógica de negocio
- ✅ Orchestración de componentes hijos
- ❌ NO estilos complejos
- ❌ NO lógica de renderizado detallada
```

**Cuándo usar**: Al crear páginas o features complejas

---

## 🎨 Reglas de Estilo y Consistencia

### Naming Conventions

```typescript
// Componentes: PascalCase
CandidateCard.tsx
KanbanBoard.tsx

// Servicios: camelCase
positionService.ts
candidateService.ts

// Tipos: PascalCase (interfaces/types)
interface CandidateProps {}
type KanbanColumn = {}

// Funciones: camelCase
const handleDragEnd = () => {}
const processCandidates = () => {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3010';
const MAX_CANDIDATES_PER_COLUMN = 50;
```

### Estructura de Archivos

```text
frontend/src/
├── components/          # Componentes reutilizables
│   ├── PositionPage.tsx       # Container (smart)
│   ├── KanbanBoard.tsx        # Presentational
│   ├── KanbanColumn.tsx       # Presentational
│   └── CandidateCard.tsx      # Presentational
├── services/           # Servicios API
│   └── positionService.ts
├── types/              # Tipos TypeScript compartidos
│   └── position.ts
└── App.js             # Router principal
```

### Imports Order

```typescript
// 1. React y librerías externas
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { DndContext } from '@dnd-kit/core';

// 2. Tipos
import { Candidate, KanbanColumn } from '../types/position';

// 3. Servicios
import { getCandidatesByPosition } from '../services/positionService';

// 4. Componentes locales
import KanbanBoard from './KanbanBoard';

// 5. Estilos (si es necesario)
import './PositionPage.css';
```

---

## 🔧 Decisiones Técnicas Documentadas

### ¿Por qué @dnd-kit en lugar de react-beautiful-dnd?

**Decisión**: Usar `@dnd-kit/core`

**Razones**:
1. ✅ Soporte activo (react-beautiful-dnd descontinuado)
2. ✅ Compatible con React 18 Strict Mode
3. ✅ Accesibilidad built-in (keyboard navigation)
4. ✅ Menor bundle size (~15KB vs ~40KB)
5. ✅ API más flexible y moderna

**Trade-off**: Requiere más configuración inicial

---

### ¿Por qué fetch en lugar de axios?

**Decisión**: Usar `fetch` nativo

**Razones**:
1. ✅ Consistencia con código existente (AddCandidateForm usa fetch)
2. ✅ Nativo del navegador (0 dependencias extra)
3. ✅ Suficiente para nuestras necesidades
4. ✅ Async/await soportado

**Trade-off**: Sin interceptors (no necesarios por ahora)

---

### ¿Por qué optimistic updates?

**Decisión**: Actualizar UI antes de confirmar con backend

**Razones**:
1. ✅ Mejor UX percibida (respuesta inmediata)
2. ✅ Aplicación se siente más rápida
3. ✅ Reduce frustración del usuario

**Implementación**: Rollback en caso de error

---

## 📚 Buenas Prácticas Aplicadas

### 1. Separación de Responsabilidades

```typescript
// ❌ MAL - Todo en un componente
const PositionPage = () => {
  return (
    <div>
      {columns.map(col => (
        <div>
          {col.candidates.map(c => (
            <div>{c.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ✅ BIEN - Componentes separados
const PositionPage = () => {
  return (
    <Container>
      <KanbanBoard columns={columns} />
    </Container>
  );
};

const KanbanBoard = ({ columns }) => {
  return (
    <Row>
      {columns.map(col => (
        <KanbanColumn key={col.id} column={col} />
      ))}
    </Row>
  );
};
```

### 2. TypeScript Estricto

```typescript
// ❌ MAL - Tipos any o faltantes
const handleDragEnd = (event: any) => {
  const candidate = event.active.data;  // ¿Qué tipo?
};

// ✅ BIEN - Tipos explícitos
interface DragEndEvent {
  active: {
    data: {
      current: {
        candidate: Candidate;
      };
    };
  };
}

const handleDragEnd = (event: DragEndEvent) => {
  const candidate = event.active.data.current.candidate;
};
```

### 3. Manejo de Errores

```typescript
// ❌ MAL - Sin manejo de errores
const loadData = async () => {
  const data = await fetchData();
  setState({ data });
};

// ✅ BIEN - Try/catch con estados
const loadData = async () => {
  try {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const data = await fetchData();
    setState(prev => ({ ...prev, data, loading: false }));
  } catch (error) {
    setState(prev => ({ 
      ...prev, 
      error: error.message, 
      loading: false 
    }));
  }
};
```

### 4. Immutability en Estado

```typescript
// ❌ MAL - Mutación directa
const handleMove = () => {
  state.columns[0].candidates.push(candidate);  // ¡Mutación!
  setState(state);  // No dispara re-render
};

// ✅ BIEN - Copia inmutable
const handleMove = () => {
  const newColumns = [...state.columns];
  newColumns[0] = { 
    ...newColumns[0], 
    candidates: [...newColumns[0].candidates, candidate]
  };
  setState(prev => ({ ...prev, columns: newColumns }));
};
```

---

## 🎯 Checklist para Nuevas Features

Antes de implementar cualquier feature nueva, verifica:

### Análisis
- [ ] ¿Entiendo la estructura actual del código?
- [ ] ¿Qué componentes existen que puedo reutilizar?
- [ ] ¿Qué patrones se están usando actualmente?

### Diseño
- [ ] ¿Cuáles son los tipos TypeScript necesarios?
- [ ] ¿Qué componentes necesito crear?
- [ ] ¿Cómo será el flujo de datos?
- [ ] ¿Qué endpoints del backend voy a usar?

### Implementación
- [ ] ¿Estoy siguiendo KISS?
- [ ] ¿Los componentes tienen una sola responsabilidad?
- [ ] ¿Estoy usando TypeScript estricto?
- [ ] ¿Manejo estados de loading/error/success?
- [ ] ¿Es responsive (mobile first)?
- [ ] ¿Es accesible (keyboard nav)?

### Testing
- [ ] ¿Probé en diferentes tamaños de pantalla?
- [ ] ¿Probé con navegación por teclado?
- [ ] ¿Probé los casos de error?
- [ ] ¿Verifiché en DevTools las API calls?

---

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Frontend
cd frontend
npm start              # Inicia dev server (http://localhost:3000)
npm run build          # Build de producción
npm test               # Ejecuta tests

# Backend
cd backend
npm run dev            # Inicia backend (http://localhost:3010)
```

### Verificación

```bash
# Ver logs del frontend
# Terminal donde corre npm start

# Ver logs del backend
# Terminal donde corre npm run dev

# Ver requests HTTP
# Firefox DevTools → Red → XHR
```

---

## 📖 Referencias

### Documentación
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [@dnd-kit](https://docs.dndkit.com/)
- [React Router v6](https://reactrouter.com/)

### Guías de Estilo
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

---

## 💡 Lecciones Aprendidas

### 1. El backend puede tener quirks
**Problema**: El endpoint PUT requiere 3 IDs diferentes (candidateId, applicationId, interviewStepId)  
**Solución**: Documentar bien los contratos de API antes de implementar  
**Aprendizaje**: Siempre verificar la API spec o hacer requests de prueba con Postman/curl

### 2. Mapeo de nombres vs IDs
**Problema**: Backend devuelve `currentInterviewStep` como string (nombre), pero PUT espera number (ID)  
**Solución**: Crear un Map de nombre → ID al procesar interview flow  
**Aprendizaje**: Transformar datos del backend al formato que necesita el frontend

### 3. TypeScript ayuda mucho
**Problema**: Sin tipos, bugs como pasar string cuando se espera number  
**Solución**: Definir todos los tipos desde el inicio  
**Aprendizaje**: El tiempo invertido en tipos se recupera en debugging

### 4. Optimistic updates mejoran UX
**Problema**: Usuario espera respuesta del servidor (latencia percibida)  
**Solución**: Actualizar UI inmediatamente, rollback si falla  
**Aprendizaje**: La percepción de velocidad es tan importante como la velocidad real

---

**Fecha de creación**: 27 de noviembre de 2025  
**Versión**: 1.0  
**Proyecto**: LTI - Position Kanban  
**Autor**: AI Assistant + Heladia Salgado

