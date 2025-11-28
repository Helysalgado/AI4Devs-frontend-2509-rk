# Fase 1 - Análisis de la Estructura del Frontend

## 📋 Objetivo
Comprender cómo está organizado el frontend para poder integrar la página `position` (Kanban) de manera coherente con la arquitectura existente.

## 🗂️ Estructura General del Proyecto

```
frontend/src/
├── App.css                      # Estilos generales (no se usan actualmente)
├── App.js                       # ✅ Router principal (ARCHIVO ACTIVO)
├── App.tsx                      # Template default (NO SE USA)
├── index.css                    # Estilos globales básicos
├── index.tsx                    # Punto de entrada de la aplicación
├── assets/
│   └── lti-logo.png            # Logo de LTI
├── components/
│   ├── AddCandidateForm.js     # Formulario para añadir candidatos
│   ├── FileUploader.js         # Componente reutilizable para subir archivos
│   ├── Positions.tsx           # 🎯 Lista de posiciones (target para integración)
│   └── RecruiterDashboard.js   # Dashboard principal (home)
└── services/
    └── candidateService.js     # Servicio API para candidatos
```

## 🎯 Hallazgos Clave

### 1. Router Principal: `App.js`

**Ubicación**: `frontend/src/App.js`

El router está implementado con `react-router-dom v6` y define las siguientes rutas:

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<RecruiterDashboard />} />
    <Route path="/add-candidate" element={<AddCandidate />} />
    <Route path="/positions" element={<Positions />} />
  </Routes>
</BrowserRouter>
```

**✅ Conclusión**: Para agregar la página Position (Kanban), necesitaremos añadir una nueva ruta como:
```javascript
<Route path="/position/:id" element={<PositionPage />} />
```

---

### 2. Componente Positions: `Positions.tsx`

**Ubicación**: `frontend/src/components/Positions.tsx`

**Características actuales**:
- Muestra una lista de posiciones en formato de tarjetas (cards)
- Usa datos mock (hardcoded), NO consume API
- Tiene filtros por: título, fecha, estado y manager
- **🎯 PUNTO CRÍTICO**: Incluye el botón "Ver proceso" que debe abrir el Kanban

```typescript
<Button variant="primary">Ver proceso</Button>  // Línea 60
```

**Datos actuales**:
```typescript
type Position = {
    title: string;
    manager: string;
    deadline: string;
    status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};
```

**✅ Conclusión**: 
- Necesitamos conectar este botón con la nueva ruta `/position/:id`
- Debemos agregar un `id` al tipo Position
- Eventualmente, reemplazar los datos mock con una llamada API real

---

### 3. Patrón de Componentes

**Convención observada**:
- Mezcla de archivos `.js` y `.tsx`
- Uso de **React Bootstrap** para UI (componentes: Card, Button, Form, Container, Row, Col)
- Componentes funcionales con hooks (useState, useEffect implícito en futuro)
- Sin carpeta `pages/`, los "pages" están en `components/`

**Componentes reutilizables identificados**:
1. **FileUploader.js**: Manejo de subida de archivos con spinner de loading
2. **Pattern común**: Cards con shadow-sm, Buttons con variantes primary/secondary

**✅ Conclusión**: Mantener consistencia con React Bootstrap y el patrón de componentes funcionales

---

### 4. Servicios API

**Ubicación**: `frontend/src/services/candidateService.js`

**Patrón actual**:
- Usa `axios` para llamadas HTTP (aunque AddCandidateForm usa `fetch`)
- URL base hardcoded: `http://localhost:3010`
- Exporta funciones específicas por operación

```javascript
export const uploadCV = async (file) => { ... }
export const sendCandidateData = async (candidateData) => { ... }
```

**✅ Conclusión**: Crear un nuevo archivo `positionService.js` (o `.ts`) siguiendo el mismo patrón:
```javascript
// Estructura propuesta
export const getInterviewFlowByPosition = async (positionId) => { ... }
export const getCandidatesByPosition = async (positionId) => { ... }
export const updateCandidateStage = async (candidateId, stageId) => { ... }
```

---

### 5. Estilos

**Sistema de estilos**:
- Bootstrap 5.3.3 (importado globalmente en App.js)
- React Bootstrap 2.10.2 para componentes
- Estilos inline cuando es necesario
- Classes de Bootstrap: `shadow-sm`, `shadow`, `mt-X`, `mb-X`, `text-center`
- No se usa CSS Modules ni Styled Components

**Paleta de colores observada**:
- Primary: Azul (botones principales)
- Secondary: Gris (botones secundarios)
- Success: Verde (badges "Contratado")
- Warning: Amarillo (badges "Abierto")
- Danger: Rojo (botones eliminar)

**✅ Conclusión**: Usar clases de Bootstrap y estilos inline, mantener consistencia visual con las cards existentes

---

## 🎯 Componente `Positions.tsx` - Análisis Detallado

### Botón "Ver proceso" (línea 60)

```typescript
<div className="d-flex justify-content-between mt-3">
    <Button variant="primary">Ver proceso</Button>
    <Button variant="secondary">Editar</Button>
</div>
```

**Estado actual**: 
- No tiene funcionalidad (onClick no definido)
- No tiene ID de posición para navegar

**Acción requerida**:
1. Importar `useNavigate` de react-router-dom
2. Agregar ID a los datos de position
3. Implementar navegación:
```typescript
const navigate = useNavigate();

<Button 
  variant="primary" 
  onClick={() => navigate(`/position/${position.id}`)}
>
  Ver proceso
</Button>
```

---

## 🛠️ Tecnologías y Dependencias Identificadas

### Instaladas y en uso:
- ✅ **React 18.3.1**
- ✅ **TypeScript 4.9.5** (parcialmente usado)
- ✅ **React Router DOM 6.23.1** (para navegación)
- ✅ **React Bootstrap 5.3.3** (UI framework)
- ✅ **React Bootstrap Icons 1.11.4** (iconos)
- ✅ **React DatePicker 6.9.0** (selector de fechas)
- ✅ **Axios** (aunque no se usa consistentemente)

### Consideraciones para el Kanban:
- No hay librería de Drag & Drop instalada
- **Opción recomendada**: `@dnd-kit/core` (ligera, accesible, compatible con React 18)
- Alternativa: `react-beautiful-dnd` (más popular pero pesada)

---

## 📝 Decisiones de Arquitectura Propuestas

### Organización de archivos para Position Page:

**Opción A - Mantener todo en `components/`** (consistente con estructura actual):
```
frontend/src/components/
├── PositionPage.tsx           # Página principal (container)
├── KanbanBoard.tsx            # Tablero completo
├── KanbanColumn.tsx           # Columna individual
├── CandidateCard.tsx          # Tarjeta de candidato
```

**Opción B - Crear carpeta `pages/` + `components/kanban/`** (mejor separación):
```
frontend/src/
├── pages/
│   └── PositionPage.tsx
└── components/
    └── kanban/
        ├── KanbanBoard.tsx
        ├── KanbanColumn.tsx
        └── CandidateCard.tsx
```

**✅ Recomendación**: Opción A para mantener consistencia con la estructura actual (KISS).

---

### Servicios API:

Crear: `frontend/src/services/positionService.ts`

```typescript
// Firmas propuestas
export const getInterviewFlowByPosition = async (positionId: number) => Promise<InterviewFlow>
export const getCandidatesByPosition = async (positionId: number) => Promise<Candidate[]>
export const updateCandidateStage = async (candidateId: number, stageId: number) => Promise<void>
```

---

## 🔍 Inconsistencias Detectadas

1. **Mezcla de .js y .tsx**: 
   - App.js, AddCandidateForm.js, RecruiterDashboard.js → JavaScript
   - Positions.tsx, index.tsx → TypeScript
   - **Decisión**: Nuevos componentes en TypeScript (.tsx)

2. **Axios vs Fetch**:
   - candidateService.js usa `axios`
   - AddCandidateForm.js usa `fetch`
   - **Decisión**: Usar `fetch` (nativo, ya en uso en componentes)

3. **App.tsx vs App.js**:
   - App.tsx es el template default (no se usa)
   - App.js es el archivo real
   - **Acción**: Eliminar App.tsx para evitar confusión

4. **URL hardcoded**:
   - Todas las llamadas API tienen `http://localhost:3010` hardcoded
   - **Mejora futura**: Crear constante de configuración o usar .env

---

## ✅ Checklist de Integración

Para integrar la página Position (Kanban):

- [ ] Crear componentes: PositionPage, KanbanBoard, KanbanColumn, CandidateCard
- [ ] Crear servicio: positionService.ts
- [ ] Agregar ruta en App.js: `/position/:id`
- [ ] Modificar botón "Ver proceso" en Positions.tsx
- [ ] Agregar IDs reales a las posiciones (cuando se conecte con API real)
- [ ] Instalar librería de drag & drop (@dnd-kit/core)
- [ ] Definir tipos TypeScript: InterviewFlow, InterviewStep, Candidate
- [ ] Aplicar estilos consistentes con Bootstrap

---

## 📊 Endpoints del Backend a Consumir

Según Fase 0, los endpoints disponibles son:

1. **GET /position/:id/interviewflow**
   - Retorna: `{ interviewFlow: { positionName, interviewFlow: { id, description, interviewSteps: [...] } } }`

2. **GET /position/:id/candidates**
   - Retorna: Array de `{ fullName, currentInterviewStep, averageScore, id, applicationId }`

3. **PUT /candidates/:id** (por confirmar si existe)
   - Para actualizar la etapa del candidato

---

## 🎯 Próximos Pasos

Con este análisis completado, estamos listos para:

1. **Fase 2**: Diseñar la arquitectura de componentes y tipos TypeScript
2. Definir contratos de datos (interfaces)
3. Crear firmas de funciones del servicio API
4. Diseñar el flujo de datos del Kanban

---

**Fecha**: 27 de noviembre de 2025  
**Rama**: `frontend-hso`  
**Estado**: ✅ Análisis completado

