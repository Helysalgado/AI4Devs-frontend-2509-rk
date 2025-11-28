# Kanban Design Decisions

## 📋 Objetivo
Documentar las decisiones de diseño, UX y técnicas tomadas para implementar el tablero Kanban de la página Position.

---

## 🎯 Principios de Diseño

### 1. KISS (Keep It Simple, Stupid)
- Interfaz minimalista sin funciones innecesarias
- Solo las acciones esenciales: ver candidatos y moverlos entre etapas
- Sin filtros, búsqueda o acciones avanzadas en la primera versión

### 2. Mobile First
- Diseño responsive desde mobile hacia desktop
- Columnas verticales en mobile (1 por fila)
- Scroll horizontal evitado en favor de vertical

### 3. Accesibilidad
- Contraste adecuado (WCAG AA)
- Navegación por teclado (Tab, Enter, Arrows)
- ARIA labels en elementos interactivos
- Focus visible en elementos draggable

### 4. Consistencia Visual
- Mantener paleta de colores del sistema LTI
- Usar componentes de React Bootstrap existentes
- Aplicar mismo patrón de shadows y borders

---

## 🎨 Decisiones de UI/UX

### Layout del Kanban

**Decisión**: Sistema de columnas con Bootstrap Grid

**Alternativas consideradas**:
1. ❌ Scroll horizontal (común en Kanban tradicionales)
   - Problema: Mala UX en mobile
   - Problema: Difícil ver todas las columnas simultáneamente

2. ✅ **Grid responsive vertical** (ELEGIDA)
   - Ventaja: Natural en mobile (scroll vertical)
   - Ventaja: Todas las columnas visibles con scroll
   - Ventaja: Compatible con Bootstrap

3. ❌ Tabs para columnas
   - Problema: Solo se ve una columna a la vez
   - Problema: Drag & drop entre tabs es confuso

**Implementación**:
```tsx
<Row className="g-3">
  <Col xs={12} md={6} lg={4}>  {/* Responsive */}
    <KanbanColumn />
  </Col>
</Row>
```

---

### Tarjetas de Candidatos

**Diseño de la Card**:

```
┌─────────────────────────────┐
│ Juan Pérez          ●  4.5  │ ← Badge con score
│ ─────────────────────────── │
│ Sin evaluaciones            │ ← Info adicional (opcional)
└─────────────────────────────┘
  ↑ Border izquierdo azul (visual cue)
```

**Elementos incluidos**:
- ✅ Nombre completo (prominente)
- ✅ Score promedio (badge con color)
- ✅ Borde izquierdo (visual identity)

**Elementos excluidos (KISS)**:
- ❌ Foto del candidato (no disponible en backend)
- ❌ Email o teléfono (no relevante en esta vista)
- ❌ Botones de acción (editar, ver detalle) - fuera de scope
- ❌ Fecha de aplicación
- ❌ Resumen de educación/experiencia

**Justificación**: Kanban es para vista rápida y movimiento entre etapas. Detalles del candidato se verían en una vista dedicada (futura).

---

### Columnas del Kanban

**Diseño del Header**:

```
┌─────────────────────────────┐
│ Initial Screening      [3]  │ ← Nombre + Badge count
├─────────────────────────────┤
│                             │
│  [Candidate Cards...]       │
│                             │
└─────────────────────────────┘
```

**Información mostrada**:
- ✅ Nombre de la etapa (InterviewStep.name)
- ✅ Cantidad de candidatos (badge)

**Información excluida**:
- ❌ Descripción del step (verbose)
- ❌ Estadísticas (promedio de scores, etc.)
- ❌ Acciones en columna (agregar candidato, etc.)

---

### Color System

**Badge de Score** (escala 0-5):

| Score | Color | Badge |
|-------|-------|-------|
| 4.5 - 5.0 | success (verde) | Excelente |
| 3.5 - 4.4 | primary (azul) | Bueno |
| 2.5 - 3.4 | warning (amarillo) | Regular |
| 0.0 - 2.4 | danger (rojo) | Bajo |
| 0 | secondary (gris) | Sin evaluación |

**Justificación**: 
- Verde = positivo (universal)
- Azul = neutral positivo
- Amarillo = advertencia suave
- Rojo = problema/alerta
- Gris = sin datos

**Columnas**:
- Header: `bg-light` (gris claro)
- Body: `#f8f9fa` (gris más claro)
- Border: Sin borde externo, shadow-sm para profundidad

---

## 🖱️ Interacciones

### Drag & Drop

**Librería elegida**: `@dnd-kit/core`

**Alternativas consideradas**:
1. ❌ `react-beautiful-dnd`
   - Problema: No tiene soporte activo
   - Problema: No compatible con React 18 Strict Mode
   - Ventaja: Animaciones muy suaves

2. ✅ **`@dnd-kit/core`** (ELEGIDA)
   - Ventaja: Mantenida activamente
   - Ventaja: Compatible con React 18
   - Ventaja: Accesible (keyboard nav)
   - Ventaja: Ligera (menor bundle size)
   - Desventaja: Requiere más configuración

3. ❌ Implementación custom
   - Problema: Complejo (drag events, touch, etc.)
   - Problema: Accesibilidad difícil de implementar
   - Problema: Bugs en diferentes browsers

**Comportamiento del Drag**:

1. **Inicio de drag**:
   - Cursor cambia a `grab`
   - Card obtiene `opacity: 0.5`
   - Hover effect se mantiene

2. **Durante drag**:
   - Card sigue el cursor
   - Cursor cambia a `grabbing`
   - Áreas droppable se destacan (opcional: border dashed)

3. **Drop válido**:
   - Card se mueve a nueva columna
   - Animación suave (150ms)
   - Llamada API inmediata (optimistic update)

4. **Drop inválido**:
   - Card vuelve a posición original
   - Animación de "rebound"

**Validaciones**:
- ✅ No permitir drop en la misma columna
- ✅ No permitir drop si hay update en progreso
- ✅ No permitir drag si hay error de conexión (futuro)

---

### Feedback Visual

**Loading States**:

1. **Carga inicial**:
   - Skeleton screens (3 columnas con placeholders)
   - Sin spinner central (mejor UX)

2. **Actualizando stage**:
   - Disable drag en toda la board
   - Opcional: Spinner pequeño en esquina superior derecha
   - Card mantiene opacidad normal (ya se movió localmente)

3. **Error**:
   - Toast notification (react-bootstrap Toast)
   - Card vuelve a columna original con animación
   - Toast auto-dismiss en 5 segundos

**Estados de vacío**:

1. **Columna vacía**:
   ```
   ┌─────────────────────────────┐
   │ Initial Screening      [0]  │
   ├─────────────────────────────┤
   │                             │
   │   No hay candidatos         │ ← Texto centrado, gris
   │                             │
   └─────────────────────────────┘
   ```

2. **Kanban vacío** (sin candidatos en ninguna columna):
   ```
   📭
   No hay candidatos en esta posición
   ```

---

## 📱 Responsive Design

### Breakpoints

| Device | Breakpoint | Columnas por fila | Notas |
|--------|------------|-------------------|-------|
| Mobile | < 768px | 1 | Vertical scroll |
| Tablet | 768px - 991px | 2 | Scroll moderado |
| Desktop | ≥ 992px | 3 | Vista completa |
| Large | ≥ 1400px | 3 | Más espacio lateral |

### Consideraciones Mobile

**Drag & Drop en touch devices**:
- Usar `@dnd-kit/touch` sensor
- Long press para iniciar drag (500ms)
- Feedback visual inmediato (vibración si disponible)
- Scroll permitido durante drag

**Columnas**:
- Full width en mobile (12/12)
- Padding lateral reducido (0.5rem vs 1rem)
- Header sticky opcional (si se implementa scroll infinito)

**Cards**:
- Tamaño mínimo de touch target: 44x44px
- Padding interno: 12px (suficiente para tap)
- Evitar texto muy pequeño (min 14px)

---

## ⚡ Performance

### Optimizaciones Aplicadas

1. **No re-renderizar toda la board**:
   ```tsx
   const MemoizedCandidateCard = React.memo(CandidateCard);
   ```

2. **Actualización optimista**:
   - Mover card en local state inmediatamente
   - No esperar respuesta del backend
   - Rollback solo si falla

3. **Evitar re-fetch innecesarios**:
   - No hacer re-fetch después de cada drag
   - Solo actualizar estado local
   - Re-fetch solo si hay error crítico

4. **Lazy loading** (futuro si hay muchos candidatos):
   - Cargar cards por demanda (scroll infinito)
   - Virtualización de listas con `react-window`

---

## 🚨 Manejo de Errores

### Escenarios y Estrategias

**1. Error 404 - Position not found**:
```tsx
if (error.status === 404) {
  showToast('Posición no encontrada', 'error');
  setTimeout(() => navigate('/positions'), 3000);
}
```

**2. Error 500 - Server error**:
```tsx
if (error.status === 500) {
  setError('Error del servidor. Intenta más tarde.');
  // Opción de reintentar
}
```

**3. Network error**:
```tsx
if (error.name === 'NetworkError') {
  showToast('Sin conexión. Verifica tu internet.', 'warning');
  // Auto-retry después de 5 segundos
}
```

**4. Error al actualizar stage**:
```tsx
// Rollback optimistic update
setCandidates(previousCandidates);
showToast('No se pudo mover el candidato. Intenta de nuevo.', 'error');
```

**5. Datos inconsistentes** (candidato en step inexistente):
```tsx
// Log warning
console.warn(`Candidate ${id} in unknown step: ${stepName}`);
// No mostrar el candidato (silent failure)
// Alternativa: Columna "Sin asignar"
```

---

## 🔐 Validaciones

### Frontend Validations

**Antes de llamar API**:
```typescript
const isValidDrop = (
  candidateId: number,
  sourceColumnId: number,
  targetColumnId: number
): boolean => {
  // 1. IDs válidos
  if (!candidateId || !targetColumnId) return false;
  
  // 2. No es la misma columna
  if (sourceColumnId === targetColumnId) return false;
  
  // 3. Columna destino existe
  const targetExists = columns.some(col => col.id === targetColumnId);
  if (!targetExists) return false;
  
  return true;
};
```

**Backend validations** (ya implementadas):
- Application existe
- InterviewStep existe
- IDs son números válidos

---

## ♿ Accesibilidad

### ARIA Labels

```tsx
// Columna
<div
  role="region"
  aria-label={`Columna ${column.name} con ${column.candidates.length} candidatos`}
>
  ...
</div>

// Card
<div
  role="button"
  aria-label={`Mover ${candidate.fullName} a otra etapa`}
  tabIndex={0}
>
  ...
</div>
```

### Navegación por Teclado

- **Tab**: Navegar entre cards
- **Enter/Space**: Seleccionar card para mover
- **Arrow keys**: Navegar entre columnas
- **Escape**: Cancelar operación de drag
- **Enter (en drop zone)**: Confirmar movimiento

**Nota**: `@dnd-kit` incluye soporte de teclado por defecto.

---

## 🎭 Estados de la UI

### Máquina de Estados

```
IDLE (default)
  ↓ [user drags]
DRAGGING
  ↓ [user drops]
UPDATING (optimistic update applied)
  ↓ [API call]
  ├─ [success] → IDLE
  └─ [error] → IDLE (rollback)
```

### Indicadores Visuales

| Estado | Indicador |
|--------|-----------|
| IDLE | Normal, draggable habilitado |
| DRAGGING | Cursor grabbing, card opacity 0.5 |
| UPDATING | Drag disabled, opcional spinner |
| ERROR | Toast rojo, rollback con animación |
| SUCCESS | Toast verde (opcional), card en nueva posición |

---

## 📊 Mejoras Futuras (Out of Scope)

### Fase 3+
- [ ] Filtrar candidatos por score, nombre
- [ ] Buscar candidatos
- [ ] Vista de detalle del candidato (modal o página)
- [ ] Agregar notas a candidatos
- [ ] Timeline de movimientos (historial)
- [ ] Mover múltiples candidatos a la vez
- [ ] Notificaciones real-time (WebSockets)
- [ ] Exportar datos del Kanban (CSV, PDF)
- [ ] Estadísticas de la posición (gráficas)
- [ ] Configurar columnas (agregar/quitar steps)
- [ ] Permisos por rol (recruiter vs manager)

### Por qué no ahora
- **KISS**: Mantener primera versión simple
- **Scope creep**: Evitar complejidad innecesaria
- **Time to market**: Iterar basado en feedback

---

## ✅ Checklist de Diseño

### Visual
- [ ] Consistencia con componentes existentes (RecruiterDashboard, Positions)
- [ ] Paleta de colores LTI aplicada
- [ ] Shadows y borders consistentes
- [ ] Typography uniforme (headings, body text)

### UX
- [ ] Drag & drop funcional y fluido
- [ ] Feedback inmediato en interacciones
- [ ] Estados de loading claros
- [ ] Mensajes de error útiles
- [ ] Empty states informativos

### Responsive
- [ ] Funcional en mobile (320px+)
- [ ] Funcional en tablet (768px+)
- [ ] Funcional en desktop (1200px+)
- [ ] Touch events funcionando
- [ ] No overflow horizontal

### Accesibilidad
- [ ] Contraste mínimo WCAG AA
- [ ] Navegación por teclado funcional
- [ ] ARIA labels en elementos interactivos
- [ ] Focus visible
- [ ] Screen reader friendly

### Performance
- [ ] No re-renders innecesarios
- [ ] Optimistic updates implementados
- [ ] Bundle size razonable (< 50kb para Kanban)
- [ ] Time to interactive < 2s

---

**Fecha**: 27 de noviembre de 2025  
**Estado**: ✅ Decisiones documentadas

