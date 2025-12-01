# 🚀 Pre-Delivery Checklist - Obligatorio antes de Commit/Push

> **Regla de Oro**: "He terminado cuando alguien que no sabe nada del proyecto puede entrar, hacer clic y llegar al final del flujo sin romper nada"

---

## 📋 Checklist Funcional (CRITICAL)

### 1. Flujo Completo End-to-End

**Objetivo**: Verificar que todo el recorrido de usuario funciona sin interrupciones.

- [ ] **Iniciar servicios desde cero**
  ```bash
  # Terminal 1 - Backend
  cd backend && npm run dev
  
  # Terminal 2 - Frontend  
  cd frontend && npm start
  ```

- [ ] **Navegar paso a paso como usuario nuevo**
  - [ ] Abrir `http://localhost:3000`
  - [ ] Hacer clic en cada enlace/botón de navegación
  - [ ] Verificar que cada página carga correctamente
  - [ ] Confirmar que NO aparecen errores 404

- [ ] **Probar el flujo específico de esta entrega**
  - [ ] Lista de posiciones → Ver proceso → Kanban → Drag & Drop → Actualización exitosa

- [ ] **Abrir DevTools y verificar**
  - [ ] Console: Sin `console.error` en rojo
  - [ ] Network: Todas las requests retornan 200/201 (o errores manejados)
  - [ ] No hay warnings críticos de React

---

### 2. Datos Reales vs Mock

**Objetivo**: Asegurar que la aplicación usa datos del backend, no hardcoded.

- [ ] **Identificar todos los datos mock en el código**
  ```bash
  grep -r "mockPositions\|mockData\|hardcoded" frontend/src/
  ```

- [ ] **Verificar que los IDs vienen del backend**
  - [ ] Los IDs usados en navegación existen en la base de datos
  - [ ] Las rutas dinámicas (`/position/:id`) funcionan con IDs reales
  - [ ] Los datos mostrados coinciden con lo que retorna la API

- [ ] **Probar con datos de la DB seed**
  - [ ] Resetear DB: `cd backend && npx prisma migrate reset`
  - [ ] Verificar que la aplicación carga los datos correctamente

---

### 3. Navegación y Rutas

**Objetivo**: Todas las rutas están conectadas y accesibles.

- [ ] **Verificar todas las rutas en `App.js`/`App.tsx`**
  ```javascript
  // Ejemplo:
  <Route path="/positions" element={<Positions />} />
  <Route path="/position/:id" element={<PositionPage />} />
  ```

- [ ] **Confirmar que los botones/enlaces están conectados**
  - [ ] Cada botón tiene un `onClick` o `href` funcional
  - [ ] Los `navigate()` usan IDs correctos
  - [ ] Los `Link` apuntan a rutas existentes

- [ ] **Probar navegación en ambas direcciones**
  - [ ] Forward: Lista → Detalle
  - [ ] Backward: Botón "Volver" funciona
  - [ ] Browser back button funciona correctamente

---

### 4. Estados de UI (Loading, Error, Empty)

**Objetivo**: La aplicación maneja todos los estados posibles.

- [ ] **Loading State**
  - [ ] Spinner/mensaje de carga aparece mientras espera API
  - [ ] No hay contenido vacío o "flash" de datos antiguos

- [ ] **Error State**
  - [ ] Mensaje de error claro y amigable
  - [ ] Botón "Reintentar" presente y funcional
  - [ ] Error no rompe la aplicación (no pantalla blanca)

- [ ] **Empty State**
  - [ ] Mensaje apropiado cuando no hay datos
  - [ ] Icono o ilustración para mejorar UX
  - [ ] Sugerencia de acción (ej: "Agrega tu primera posición")

- [ ] **Success State**
  - [ ] Confirmación visual de acciones exitosas
  - [ ] Feedback inmediato (optimistic updates)

---

### 5. Responsividad

**Objetivo**: La aplicación funciona en todos los tamaños de pantalla.

- [ ] **Abrir DevTools (F12) → Toggle Device Toolbar**

- [ ] **Probar en Mobile (< 768px)**
  - [ ] Layout se ajusta (columnas apiladas verticalmente)
  - [ ] Botones son tocables (≥44px)
  - [ ] No hay scroll horizontal
  - [ ] Touch drag funciona (si aplica)

- [ ] **Probar en Tablet (768px - 991px)**
  - [ ] Layout intermedio funciona correctamente
  - [ ] Spacing apropiado

- [ ] **Probar en Desktop (≥ 992px)**
  - [ ] Vista completa sin problemas
  - [ ] Hover effects funcionan

---

### 6. Integración Backend

**Objetivo**: Frontend y backend están sincronizados.

- [ ] **Verificar que el backend está corriendo**
  ```bash
  curl http://localhost:3010/position/1/interviewflow
  curl http://localhost:3010/position/1/candidates
  ```

- [ ] **Confirmar que los endpoints existen**
  - [ ] URLs en servicios coinciden con rutas del backend
  - [ ] Métodos HTTP correctos (GET, POST, PUT, DELETE)
  - [ ] Payloads coinciden con lo que espera el backend

- [ ] **Probar errores de backend**
  - [ ] Apagar backend → Error manejado en frontend
  - [ ] Endpoint inexistente (404) → Mensaje apropiado
  - [ ] Server error (500) → No rompe la aplicación

---

### 7. Calidad de Código

**Objetivo**: El código cumple con estándares del proyecto.

- [ ] **No hay errores de TypeScript**
  ```bash
  cd frontend && npx tsc --noEmit
  ```

- [ ] **No hay linter errors críticos**
  - [ ] ESLint warnings revisados
  - [ ] No hay `any` types sin justificación
  - [ ] No hay imports sin usar

- [ ] **No hay console.log olvidados**
  ```bash
  grep -r "console.log" frontend/src/components/
  ```

- [ ] **Código sigue las convenciones del proyecto**
  - [ ] Nombres consistentes (camelCase, PascalCase)
  - [ ] Comentarios donde es necesario
  - [ ] Funciones pequeñas y enfocadas

---

### 8. Documentación

**Objetivo**: La entrega está documentada para revisión.

- [ ] **README actualizado** (si aplica)
  - [ ] Instrucciones de setup actualizadas
  - [ ] Nuevas features documentadas

- [ ] **Comentarios en código complejo**
  - [ ] Lógica no obvia explicada
  - [ ] TODOs marcados claramente

- [ ] **Commits con mensajes claros**
  ```
  ✅ feat(kanban): add drag & drop functionality
  ❌ wip / fix / changes
  ```

---

## 🧪 Prueba de Usuario Final

**Esta es la prueba definitiva antes de entregar:**

1. **Cierra todos los terminales y navegadores**

2. **Resetea el entorno**
   ```bash
   cd backend && npx prisma migrate reset
   cd backend && npm run dev
   cd frontend && npm start
   ```

3. **Actúa como un usuario que no conoce el proyecto**
   - Abre `http://localhost:3000`
   - Navega usando SOLO la interfaz (no escribas URLs manualmente)
   - Prueba cada botón y link
   - Intenta "romper" la aplicación (clicks rápidos, navegación rara)

4. **Pregúntate**
   - ¿Llegué al final del flujo sin problemas?
   - ¿Entendí qué hacer en cada paso?
   - ¿Vi algún error o comportamiento extraño?

**Si la respuesta a alguna es "No" → NO ESTÁ LISTO PARA ENTREGAR**

---

## 📝 Checklist por Tipo de Tarea

### Para Features Nuevas
- [ ] Todos los items de "Checklist Funcional"
- [ ] Feature funciona end-to-end
- [ ] Documentación actualizada
- [ ] Tests manuales completos

### Para Bug Fixes
- [ ] Bug reproducido antes del fix
- [ ] Fix verificado manualmente
- [ ] No se introdujeron regresiones
- [ ] Edge cases probados

### Para Refactors
- [ ] Funcionalidad NO cambió
- [ ] Todas las features anteriores funcionan
- [ ] Performance no empeoró
- [ ] Código más limpio/mantenible

---

## 🚨 Red Flags - NO Entregar Si

- ❌ Algún link/botón no hace nada
- ❌ Aparece pantalla blanca o error 404
- ❌ Console muestra errores en rojo
- ❌ Datos mock donde deberían ser reales
- ❌ Navegación rota en algún punto
- ❌ Backend no responde y no hay error handling
- ❌ Responsive roto en mobile
- ❌ No probaste el flujo completo personalmente

---

## ✅ Listo para Entregar Cuando

- ✅ Completaste TODO el checklist funcional
- ✅ Probaste el flujo como usuario nuevo
- ✅ Todas las rutas navegan correctamente
- ✅ Todos los estados (loading/error/empty) funcionan
- ✅ Datos vienen del backend (no mock)
- ✅ DevTools limpio (sin errores)
- ✅ Responsive funciona en 3 breakpoints
- ✅ Puedes demostrar la feature sin explicaciones

---

## 🎯 Principio Fundamental

> **"Si necesitas explicarle a alguien cómo usar tu entrega, NO está terminada"**

Una entrega de calidad es:
- **Auto-explicativa**: La UI guía al usuario
- **Robusta**: No se rompe con uso normal
- **Completa**: El flujo funciona end-to-end
- **Profesional**: Parece producto final, no prototipo

---

**Fecha de creación**: 1 de diciembre de 2025  
**Última actualización**: 1 de diciembre de 2025  
**Uso**: Obligatorio antes de cada commit a main/rama de entrega

