# Architecture - Position Page (Kanban)

## 📋 Objetivo
Definir la estructura de componentes, sus responsabilidades, props y cómo interactúan entre sí para crear la página Position (Kanban).

---

## 🏗️ Diagrama de Componentes

```
PositionPage (Container/Smart Component)
│
├── Header Section
│   ├── BackButton (navigate to /positions)
│   ├── Position Title
│   └── Position Info (optional: deadline, status)
│
└── KanbanBoard (Presentational Component)
    │
    ├── KanbanColumn (x N columns)
    │   ├── Column Header
    │   │   ├── Step Name
    │   │   └── Candidate Count
    │   │
    │   └── CandidateCard (x M candidates)
    │       ├── Candidate Name
    │       ├── Average Score Badge
    │       └── Drag Handle (implicit)
    │
    └── EmptyState (when no candidates)
```

---

## 📦 Componentes Detallados

### 1. PositionPage (Container Component)

**Archivo**: `frontend/src/components/PositionPage.tsx`

**Responsabilidad**:
- Obtener el `positionId` de los params de la URL
- Hacer fetch de interview flow y candidates
- Manejar estado de loading, error y datos
- Procesar datos del backend y transformarlos
- Manejar lógica de drag & drop (onDragEnd)
- Actualizar estado local y hacer llamadas API

**Props**: Ninguna (obtiene datos de URL params)

**State**:
```typescript
interface PositionPageState {
  positionId: number;
  positionName: string;
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
  updating: boolean; // Para mostrar loading en drag & drop
}
```

**Hooks utilizados**:
- `useParams()` - Obtener positionId de URL
- `useState()` - Manejar state local
- `useEffect()` - Fetch data on mount
- `useNavigate()` - Redirigir en caso de error 404

**Estructura**:
```tsx
const PositionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [state, setState] = useState<PositionPageState>({
    positionId: parseInt(id!),
    positionName: '',
    columns: [],
    loading: true,
    error: null,
    updating: false
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // 1. Fetch interview flow
      // 2. Fetch candidates
      // 3. Process and merge data
      // 4. Update state
    } catch (error) {
      // Handle errors
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    // 1. Validate drop
    // 2. Optimistic update
    // 3. Call API
    // 4. Handle success/error
  };

  if (state.loading) return <LoadingSkeleton />;
  if (state.error) return <ErrorMessage message={state.error} />;

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="link" 
          onClick={() => navigate('/positions')}
        >
          ← Volver
        </Button>
        <h2 className="ms-3">{state.positionName}</h2>
      </div>

      {/* Kanban */}
      <KanbanBoard 
        columns={state.columns}
        onDragEnd={handleDragEnd}
        isUpdating={state.updating}
      />
    </Container>
  );
};
```

**¿Qué NO debe hacer?**
- ❌ Renderizar lógica de columnas o cards (delegar a componentes hijos)
- ❌ Manejar estilos del Kanban (solo layout container)
- ❌ Lógica de negocio compleja (mover a funciones helper)

---

### 2. KanbanBoard (Presentational Component)

**Archivo**: `frontend/src/components/KanbanBoard.tsx`

**Responsabilidad**:
- Renderizar el layout del tablero Kanban
- Configurar el contexto de drag & drop (DndContext)
- Distribuir columnas en un layout responsive
- Manejar el evento onDragEnd y propagarlo al padre

**Props**:
```typescript
interface KanbanBoardProps {
  columns: KanbanColumn[];
  onDragEnd: (result: DropResult) => void;
  isUpdating?: boolean;
}
```

**Estructura**:
```tsx
const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns, 
  onDragEnd,
  isUpdating = false 
}) => {
  return (
    <DndContext onDragEnd={onDragEnd}>
      <Row className="g-3">
        {columns.map(column => (
          <Col key={column.id} xs={12} md={6} lg={4}>
            <KanbanColumn 
              column={column}
              isDisabled={isUpdating}
            />
          </Col>
        ))}
      </Row>

      {/* Empty state */}
      {columns.every(col => col.candidates.length === 0) && (
        <EmptyState message="No hay candidatos en esta posición" />
      )}
    </DndContext>
  );
};
```

**Estilos**:
- Layout responsivo con Bootstrap Grid
- Desktop (lg): 3 columnas por fila (4/12)
- Tablet (md): 2 columnas por fila (6/12)
- Mobile (xs): 1 columna por fila (12/12)
- Gap entre columnas: `g-3` (1rem)

**¿Qué NO debe hacer?**
- ❌ Manejar estado de datos
- ❌ Hacer llamadas API
- ❌ Lógica de transformación de datos

---

### 3. KanbanColumn (Presentational Component)

**Archivo**: `frontend/src/components/KanbanColumn.tsx`

**Responsabilidad**:
- Renderizar una columna individual del Kanban
- Mostrar header con nombre y count de candidatos
- Configurar drop zone (área donde se pueden soltar cards)
- Renderizar las cards de candidatos

**Props**:
```typescript
interface KanbanColumnProps {
  column: KanbanColumn;
  isDisabled?: boolean;
}

interface KanbanColumn {
  id: number;
  name: string;
  orderIndex: number;
  candidates: Candidate[];
}
```

**Estructura**:
```tsx
const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  isDisabled = false 
}) => {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    disabled: isDisabled
  });

  return (
    <Card className="shadow-sm h-100">
      {/* Header */}
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{column.name}</h5>
          <Badge bg="secondary">{column.candidates.length}</Badge>
        </div>
      </Card.Header>

      {/* Droppable area */}
      <Card.Body 
        ref={setNodeRef}
        className="kanban-column-body"
        style={{ minHeight: '400px' }}
      >
        {column.candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id}
            candidate={candidate}
            isDisabled={isDisabled}
          />
        ))}

        {/* Empty column state */}
        {column.candidates.length === 0 && (
          <div className="text-center text-muted py-5">
            <small>No hay candidatos</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
```

**Estilos específicos**:
```css
.kanban-column-body {
  min-height: 400px;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  background-color: #f8f9fa;
  padding: 1rem;
}

.kanban-column-body::-webkit-scrollbar {
  width: 8px;
}

.kanban-column-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}
```

**¿Qué NO debe hacer?**
- ❌ Manejar lógica de drag (solo configurar drop zone)
- ❌ Transformar datos de candidatos
- ❌ Hacer peticiones API

---

### 4. CandidateCard (Presentational Component)

**Archivo**: `frontend/src/components/CandidateCard.tsx`

**Responsabilidad**:
- Renderizar una tarjeta de candidato
- Configurar como draggable
- Mostrar información del candidato de forma visual
- Indicar estado de drag (dragging/not dragging)

**Props**:
```typescript
interface CandidateCardProps {
  candidate: Candidate;
  isDisabled?: boolean;
}

interface Candidate {
  id: number;
  fullName: string;
  averageScore: number;
  currentInterviewStepId: number;
  currentInterviewStepName: string;
  applicationId: number;
}
```

**Estructura**:
```tsx
const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  isDisabled = false 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `candidate-${candidate.id}`,
    disabled: isDisabled,
    data: {
      candidate: candidate
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDisabled ? 'default' : 'grab'
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 shadow-sm candidate-card"
    >
      <Card.Body className="p-3">
        {/* Header: Name + Score */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="mb-0">{candidate.fullName}</h6>
          {candidate.averageScore > 0 && (
            <Badge 
              bg={getScoreBadgeColor(candidate.averageScore)}
              className="ms-2"
            >
              {candidate.averageScore.toFixed(1)}
            </Badge>
          )}
        </div>

        {/* Optional: Additional info */}
        {candidate.averageScore === 0 && (
          <small className="text-muted">Sin evaluaciones</small>
        )}
      </Card.Body>
    </Card>
  );
};

// Helper function
const getScoreBadgeColor = (score: number): string => {
  if (score >= 4.5) return 'success';
  if (score >= 3.5) return 'primary';
  if (score >= 2.5) return 'warning';
  return 'danger';
};
```

**Estilos específicos**:
```css
.candidate-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 3px solid #007bff;
}

.candidate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.candidate-card:active {
  cursor: grabbing !important;
}
```

**¿Qué NO debe hacer?**
- ❌ Manejar lógica de drop o actualización
- ❌ Hacer llamadas API
- ❌ Contener lógica de negocio

---

## 🔄 Flujo de Interacción

### Carga Inicial

```
User → /position/1
      ↓
PositionPage mounts
      ↓
useEffect() triggers
      ↓
[Parallel requests]
├─ getInterviewFlowByPosition(1)
└─ getCandidatesByPosition(1)
      ↓
Process & merge data
      ↓
setState({ columns, positionName })
      ↓
Render KanbanBoard
      ↓
Render N x KanbanColumn
      ↓
Render M x CandidateCard per column
```

### Drag & Drop

```
User drags CandidateCard
      ↓
useDraggable() captures event
      ↓
Visual feedback (opacity, cursor)
      ↓
User drops on KanbanColumn
      ↓
useDroppable() captures drop
      ↓
DndContext fires onDragEnd
      ↓
KanbanBoard propagates to PositionPage
      ↓
PositionPage.handleDragEnd()
      ↓
[Optimistic update]
Update local state immediately
      ↓
[API call]
updateCandidateStage(...)
      ↓
Success → Keep changes
Error → Rollback + show toast
```

---

## 📝 Tipos TypeScript Consolidados

```typescript
// types/position.ts

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface Candidate {
  id: number;
  fullName: string;
  averageScore: number;
  currentInterviewStepId: number;
  currentInterviewStepName: string;
  applicationId: number;
}

export interface KanbanColumn {
  id: number;
  name: string;
  orderIndex: number;
  candidates: Candidate[];
}

export interface PositionPageState {
  positionId: number;
  positionName: string;
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
  updating: boolean;
}

// Para drag & drop
export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        candidate: Candidate;
      };
    };
  };
  over: {
    id: string;
  } | null;
}
```

---

## 🎨 Componentes de Utilidad

### LoadingSkeleton

**Archivo**: `frontend/src/components/LoadingSkeleton.tsx`

```tsx
const LoadingSkeleton: React.FC = () => (
  <Container className="mt-4">
    <div className="mb-4">
      <div className="placeholder-glow">
        <span className="placeholder col-4"></span>
      </div>
    </div>
    <Row className="g-3">
      {[1, 2, 3].map(i => (
        <Col key={i} md={4}>
          <Card className="shadow-sm">
            <Card.Header className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </Card.Header>
            <Card.Body>
              {[1, 2].map(j => (
                <div key={j} className="placeholder-glow mb-2">
                  <span className="placeholder col-12"></span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);
```

### ErrorMessage

**Archivo**: `frontend/src/components/ErrorMessage.tsx`

```tsx
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <Container className="mt-5">
    <Alert variant="danger" className="text-center">
      <h5>⚠️ Error</h5>
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline-danger" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Alert>
  </Container>
);
```

### EmptyState

**Archivo**: `frontend/src/components/EmptyState.tsx`

```tsx
interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon = '📭' 
}) => (
  <div className="text-center py-5 text-muted">
    <h1 style={{ fontSize: '4rem' }}>{icon}</h1>
    <p>{message}</p>
  </div>
);
```

---

## ✅ Checklist de Implementación

### Componentes Principales
- [ ] PositionPage.tsx (Smart component)
- [ ] KanbanBoard.tsx (Layout + DnD context)
- [ ] KanbanColumn.tsx (Droppable area)
- [ ] CandidateCard.tsx (Draggable item)

### Componentes de Utilidad
- [ ] LoadingSkeleton.tsx
- [ ] ErrorMessage.tsx
- [ ] EmptyState.tsx

### Tipos TypeScript
- [ ] types/position.ts (interfaces compartidas)

### Estilos
- [ ] Agregar CSS custom en index.css o archivo dedicado
- [ ] Verificar responsive en mobile, tablet, desktop

### Integración
- [ ] Agregar ruta en App.js
- [ ] Conectar botón "Ver proceso" en Positions.tsx
- [ ] Agregar librería @dnd-kit/core

---

**Fecha**: 27 de noviembre de 2025  
**Estado**: ✅ Arquitectura definida

