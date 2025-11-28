# API Flow Analysis - Position Page (Kanban)

## 📋 Objetivo
Documentar los endpoints del backend, sus contratos de datos y cómo fluirá la información en la página Position (Kanban).

---

## 🔌 Endpoints Disponibles

### 1. GET /position/:id/interviewflow

**Propósito**: Obtener el flujo de entrevistas (columnas del Kanban) para una posición específica.

**Request**:
```
GET http://localhost:3010/position/1/interviewflow
```

**Response exitosa** (200):
```json
{
  "interviewFlow": {
    "positionName": "Senior Full-Stack Engineer",
    "interviewFlow": {
      "id": 1,
      "description": "Standard development interview process",
      "interviewSteps": [
        {
          "id": 1,
          "interviewFlowId": 1,
          "interviewTypeId": 1,
          "name": "Initial Screening",
          "orderIndex": 1
        },
        {
          "id": 2,
          "interviewFlowId": 1,
          "interviewTypeId": 2,
          "name": "Technical Interview",
          "orderIndex": 2
        },
        {
          "id": 3,
          "interviewFlowId": 1,
          "interviewTypeId": 3,
          "name": "Manager Interview",
          "orderIndex": 2
        }
      ]
    }
  }
}
```

**Errores**:
- 404: Position not found
- 500: Server error

**Uso en frontend**:
- Cargar al montar el componente `PositionPage`
- Los `interviewSteps` se convierten en columnas del Kanban
- Ordenar por `orderIndex` para mostrar columnas en el orden correcto

---

### 2. GET /position/:id/candidates

**Propósito**: Obtener todos los candidatos que han aplicado a una posición con su etapa actual.

**Request**:
```
GET http://localhost:3010/position/1/candidates
```

**Response exitosa** (200):
```json
[
  {
    "fullName": "John Doe",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 5,
    "id": 1,
    "applicationId": 1
  },
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4,
    "id": 2,
    "applicationId": 3
  },
  {
    "fullName": "Carlos García",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 0,
    "id": 3,
    "applicationId": 4
  }
]
```

**Campos**:
- `fullName`: Nombre completo del candidato
- `currentInterviewStep`: Nombre de la etapa actual (string, debe matchear con un `interviewSteps[].name`)
- `averageScore`: Promedio de puntuaciones de entrevistas realizadas
- `id`: ID del candidato (Candidate.id)
- `applicationId`: ID de la aplicación (Application.id) - **⚠️ IMPORTANTE para actualizar stage**

**Errores**:
- 500: Error retrieving candidates

**Uso en frontend**:
- Cargar al montar el componente `PositionPage`
- Distribuir candidatos en columnas según `currentInterviewStep`
- Usar `applicationId` (NO `id`) al actualizar la etapa

---

### 3. PUT /candidates/:id

**Propósito**: Actualizar la etapa del candidato en el proceso de entrevistas.

**Request**:
```
PUT http://localhost:3010/candidates/1
Content-Type: application/json

{
  "applicationId": 1,
  "currentInterviewStep": 2
}
```

**Parámetros**:
- **URL param `id`**: ID del **candidato** (Candidate.id)
- **Body**:
  - `applicationId` (number): ID de la aplicación (Application.id)
  - `currentInterviewStep` (number): ID del nuevo InterviewStep

**Response exitosa** (200):
```json
{
  "message": "Candidate stage updated successfully",
  "data": { /* updated application */ }
}
```

**Errores**:
- 400: Invalid ID format, Invalid currentInterviewStep format
- 404: Application not found
- 500: Error updating candidate stage

**⚠️ Importante**:
- Se necesitan **3 IDs**: candidateId (URL), applicationId (body), interviewStepId (body)
- El endpoint espera el **ID del InterviewStep**, no el nombre

**Uso en frontend**:
- Llamar al hacer drag & drop de una tarjeta de candidato
- Implementar optimistic UI update
- Rollback si falla la petición

---

## 📊 Flujo de Datos en el Frontend

### Estado Inicial

```
┌─────────────────────────────────────────────────┐
│           PositionPage (mounted)                │
│                                                 │
│  1. useEffect() → fetch interview flow          │
│  2. useEffect() → fetch candidates              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Loading State                      │
│   • Show skeleton or spinner                    │
│   • Block interactions                          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│          Data Processing                        │
│                                                 │
│  1. interviewSteps → columns                    │
│  2. candidates → distribute by currentStep      │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│            Render Kanban                        │
│                                                 │
│  KanbanBoard(columns, candidatesByColumn)       │
└─────────────────────────────────────────────────┘
```

### Flujo de Actualización (Drag & Drop)

```
┌─────────────────────────────────────────────────┐
│   User drags candidate card to new column       │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         onDragEnd handler                       │
│  • Get candidateId                              │
│  • Get applicationId                            │
│  • Get target interviewStepId                   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│      Optimistic UI Update                       │
│  • Move card in local state immediately         │
│  • Show visual feedback (subtle animation)      │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         API Call                                │
│  PUT /candidates/:candidateId                   │
│  Body: { applicationId, currentInterviewStep }  │
└─────────────────────────────────────────────────┘
                        ↓
           ┌────────────┴────────────┐
           ↓                         ↓
┌──────────────────┐      ┌──────────────────┐
│    Success       │      │     Error        │
│  • Keep changes  │      │  • Rollback UI   │
│  • Show toast ✓  │      │  • Show error ⚠  │
└──────────────────┘      └──────────────────┘
```

---

## 🎯 Contratos de Datos (TypeScript)

### Tipos del Backend (response)

```typescript
// Response de GET /position/:id/interviewflow
interface InterviewFlowResponse {
  interviewFlow: {
    positionName: string;
    interviewFlow: {
      id: number;
      description: string | null;
      interviewSteps: InterviewStep[];
    };
  };
}

interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

// Response de GET /position/:id/candidates
interface CandidateResponse {
  fullName: string;
  currentInterviewStep: string; // Nombre del step (no ID)
  averageScore: number;
  id: number; // Candidate ID
  applicationId: number; // ⚠️ CRÍTICO para updates
}

// Request de PUT /candidates/:id
interface UpdateCandidateStageRequest {
  applicationId: number;
  currentInterviewStep: number; // ID del InterviewStep (no nombre)
}

// Response de PUT /candidates/:id
interface UpdateCandidateStageResponse {
  message: string;
  data: any; // Application actualizada
}
```

### Tipos del Frontend (state)

```typescript
// Para manejar el estado local
interface Candidate {
  id: number;
  fullName: string;
  averageScore: number;
  currentInterviewStepId: number; // ID, no nombre
  currentInterviewStepName: string;
  applicationId: number;
}

interface KanbanColumn {
  id: number; // InterviewStep.id
  name: string;
  orderIndex: number;
  candidates: Candidate[];
}

interface PositionPageState {
  positionId: number;
  positionName: string;
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
}
```

---

## 🔄 Transformación de Datos

### Del Backend al Frontend

**Paso 1: Procesar Interview Flow**

```typescript
const processInterviewFlow = (response: InterviewFlowResponse) => {
  const { positionName, interviewFlow } = response.interviewFlow;
  
  const columns: KanbanColumn[] = interviewFlow.interviewSteps
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(step => ({
      id: step.id,
      name: step.name,
      orderIndex: step.orderIndex,
      candidates: []
    }));
  
  return { positionName, columns };
};
```

**Paso 2: Procesar Candidates**

```typescript
const processCandidates = (
  candidates: CandidateResponse[],
  columns: KanbanColumn[]
) => {
  // Crear mapa de nombre → step ID
  const stepNameToId = new Map(
    columns.map(col => [col.name, col.id])
  );
  
  // Distribuir candidatos en columnas
  candidates.forEach(candidate => {
    const stepId = stepNameToId.get(candidate.currentInterviewStep);
    
    if (stepId) {
      const column = columns.find(col => col.id === stepId);
      
      if (column) {
        column.candidates.push({
          id: candidate.id,
          fullName: candidate.fullName,
          averageScore: candidate.averageScore,
          currentInterviewStepId: stepId,
          currentInterviewStepName: candidate.currentInterviewStep,
          applicationId: candidate.applicationId
        });
      }
    }
  });
  
  return columns;
};
```

---

## 🚨 Casos de Error a Manejar

### 1. Position no encontrada (404)
```typescript
if (response.status === 404) {
  // Mostrar mensaje: "Posición no encontrada"
  // Redirigir a /positions después de 3 segundos
}
```

### 2. Candidatos sin stage válido
```typescript
// Si un candidato tiene currentInterviewStep que no existe en interviewSteps
// Opción 1: No mostrar el candidato
// Opción 2: Crear columna "Sin asignar"
// Recomendación: Log warning + no mostrar
```

### 3. Error al actualizar stage
```typescript
try {
  await updateCandidateStage(...);
} catch (error) {
  // Rollback optimistic update
  setCandidates(previousCandidates);
  // Show toast error
  showToast('Error al mover candidato. Intenta de nuevo.', 'error');
}
```

### 4. Datos inconsistentes
```typescript
// Si candidates.length > 0 pero columns.length === 0
// → Mostrar mensaje: "Esta posición no tiene proceso definido"
```

---

## ⚡ Optimizaciones

### 1. Caché local
- Guardar interview flow en sessionStorage (no cambia frecuentemente)
- Invalidar caché si se detecta un cambio

### 2. Debounce en drag & drop
- Si el usuario arrastra rápidamente múltiples veces
- Esperar 100ms antes de llamar API

### 3. Batch updates
- Si se implementa en el futuro: mover múltiples candidatos
- Una sola llamada API con array de updates

---

## 📝 Checklist de Implementación

### Servicios API (positionService.ts)

- [ ] `getInterviewFlowByPosition(positionId: number): Promise<InterviewFlowResponse>`
- [ ] `getCandidatesByPosition(positionId: number): Promise<CandidateResponse[]>`
- [ ] `updateCandidateStage(candidateId: number, applicationId: number, stepId: number): Promise<void>`

### Handlers de Datos

- [ ] `processInterviewFlow()` - Transformar response a columns
- [ ] `processCandidates()` - Distribuir candidatos en columnas
- [ ] `handleDragEnd()` - Manejar drop event y llamar API

### Manejo de Errores

- [ ] Error 404 → Redirigir con mensaje
- [ ] Error 500 → Mostrar toast y mantener estado
- [ ] Network error → Mostrar mensaje de reconexión

### Estados de UI

- [ ] Loading inicial (skeleton)
- [ ] Empty state (sin candidatos)
- [ ] Error state
- [ ] Drag preview
- [ ] Success/error toasts

---

**Fecha**: 27 de noviembre de 2025  
**Estado**: ✅ Análisis completado

