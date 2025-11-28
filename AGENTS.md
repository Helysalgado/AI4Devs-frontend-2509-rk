# AGENTS.md

LTI ATS (Applicant Tracking System) - A modern recruitment platform with Kanban-style candidate management.

## Setup Commands

**Frontend:**
```bash
cd frontend
npm install          # Install dependencies
npm start            # Dev server at http://localhost:3000
```

**Backend:**
```bash
cd backend
npm install          # Install dependencies
npm run dev          # API server at http://localhost:3010
```

**Database:**
```bash
cd backend
npx prisma migrate dev      # Run migrations
npx prisma db seed          # Seed test data (uses ts-node-dev)
```

## Tech Stack

- Frontend: React 18 + TypeScript 4.9
- UI: React Bootstrap 5.3.3
- State: React hooks (useState, useEffect)
- Routing: React Router v6
- Drag & Drop: @dnd-kit/core + @dnd-kit/utilities
- API: Fetch (native, no axios)
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL

## Code Style

### TypeScript
- Strict mode enabled
- No `any` types (use explicit types or `unknown`)
- Props interface for every component: `interface ComponentNameProps {}`
- Export reusable types from `src/types/`

### React
- Functional components only (NO class components)
- **Hooks Rules (CRITICAL):**
  - Hooks MUST be called at the top level of the component
  - NEVER call hooks after early returns, inside conditionals, or loops
  - Call hooks in the same order every time
  - Example: ✅ Hooks first, then conditional returns
- useState with descriptive names: `isLoading`, `hasError`, `candidates`
- Immutable state updates (spread operator, no mutations)

### Naming Conventions
- **Components:** PascalCase (`CandidateCard.tsx`)
- **Services:** camelCase (`positionService.ts`)
- **Types:** camelCase in files (`position.ts`), PascalCase for interfaces
- **Functions:** camelCase (`handleDragEnd`, `loadData`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Booleans:** Prefix with is/has/should (`isLoading`, `hasError`)

## Architecture Patterns

### Component Structure
- **Smart components** (containers): Handle state, API calls, business logic
  - Location: `src/components/[PageName].tsx`
  - Example: `PositionPage.tsx`, `RecruiterDashboard.js`
  
- **Dumb components** (presentational): Receive props, render UI only
  - Co-located with smart components
  - Example: `KanbanBoard.tsx`, `CandidateCard.tsx`

### File Organization
```
frontend/src/
├── types/           # TypeScript interfaces
├── services/        # API calls (fetch-based)
├── components/      # React components
└── App.js          # Main router

backend/src/
├── application/services/   # Business logic
├── domain/models/         # Data models
├── presentation/controllers/  # Request handlers
└── routes/               # Express routes
```

### Component Template
```typescript
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';

interface ComponentNameProps {
  // Props with explicit types
}

const ComponentName: React.FC<ComponentNameProps> = ({ 
  // Destructure props
}) => {
  // 1. ✅ Hooks FIRST (always at top level)
  const [state, setState] = useState<StateType>(...);
  
  // 2. Event handlers
  const handleAction = () => { ... };
  
  // 3. ✅ Early returns AFTER hooks
  if (invalidInput) return <ErrorComponent />;
  if (loading) return <LoadingComponent />;
  
  // 4. Main render
  return (
    <Container>
      {/* JSX */}
    </Container>
  );
};

export default ComponentName;
```

### Smart Component Pattern
```typescript
const PageName: React.FC = () => {
  const [state, setState] = useState<StateType>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await apiCall();
      setState(prev => ({ ...prev, data, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };
  
  if (state.loading) return <Spinner />;
  if (state.error) return <ErrorMessage />;
  
  return <MainContent />;
};
```

### API Service Pattern
```typescript
// services/entityService.ts
const API_BASE_URL = 'http://localhost:3010';

export const getEntity = async (id: number): Promise<EntityType> => {
  const response = await fetch(`${API_BASE_URL}/entity/${id}`);
  if (!response.ok) throw new Error('Error message');
  return response.json();
};
```

## Testing Instructions

### Manual Testing Checklist
Before committing, verify:
- [ ] Works in Chrome and Firefox
- [ ] Responsive (mobile/tablet/desktop) - Use DevTools (Ctrl+Shift+M)
- [ ] No `console.error` in browser console
- [ ] Network requests return 200 (check DevTools Network tab)
- [ ] Loading states display correctly
- [ ] Error states display with retry button
- [ ] Empty states show appropriate messages

### API Testing
Use Firefox/Chrome DevTools Network tab:
- Base URL: `http://localhost:3010`
- Position endpoints: 
  - `GET /position/:id/interviewflow` - Get interview steps
  - `GET /position/:id/candidates` - Get candidates
  - `PUT /candidates/:id` - Update candidate stage
- Check request payload and response
- Verify status codes (200 = success, 404 = not found, 500 = server error)

### Testing Drag & Drop
1. Open DevTools Network tab
2. Filter by "XHR" or "Fetch/XHR"
3. Drag a candidate card to another column
4. Verify PUT request appears with:
   - URL: `/candidates/{candidateId}`
   - Body: `{ applicationId: X, currentInterviewStep: Y }`
   - Status: 200

## UI/UX Guidelines

### React Bootstrap
- Use Bootstrap components: `<Container>`, `<Row>`, `<Col>`, `<Button>`, `<Card>`
- Utility classes: `mt-3`, `mb-4`, `p-3`, `text-center`
- Shadows on elevated elements: `shadow-sm`
- Badges for status/scores: `<Badge bg="success">5.0</Badge>`

### Responsive Design
- **Mobile first** approach
- Use Bootstrap Grid: `<Col xs={12} md={6} lg={4}>`
- Breakpoints: 
  - xs (< 768px): 1 column, vertical stack
  - md (768-991px): 2 columns
  - lg (≥ 992px): 3 columns
- Touch targets: minimum 44x44px for mobile
- Test in Firefox/Chrome DevTools responsive mode

### Required UI States
**Always implement these three states:**

1. **Loading state:**
```typescript
if (loading) {
  return (
    <Container className="text-center mt-5">
      <Spinner animation="border" />
    </Container>
  );
}
```

2. **Error state:**
```typescript
if (error) {
  return (
    <Alert variant="danger">
      <p>{error}</p>
      <Button onClick={retry}>Reintentar</Button>
    </Alert>
  );
}
```

3. **Empty state:**
```typescript
{items.length === 0 && (
  <div className="text-center py-5">
    <h1 style={{ fontSize: '4rem' }}>📭</h1>
    <p className="text-muted">No hay items</p>
  </div>
)}
```

### Optimistic Updates
For user actions (drag, click, delete):
1. Update UI immediately
2. Call API
3. On success: keep changes
4. On error: rollback + show error message

```typescript
const handleAction = async () => {
  const previousState = state;
  
  try {
    // 1. Optimistic update
    setState(newState);
    
    // 2. API call
    await apiCall();
  } catch (error) {
    // 3. Rollback on error
    setState(previousState);
    alert(error.message);
  }
};
```

### Styling
- Prefer Bootstrap classes over custom CSS
- Inline styles ONLY for dynamic values (`opacity`, `transform`)
- Custom CSS in `index.css` with prefixed names:
  - `.kanban-column`
  - `.candidate-card`
  - `.custom-scrollbar`

## API Integration

### Fetch Pattern
```typescript
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Error message');
  }
  
  return await response.json();
} catch (error) {
  // Handle error
  throw error;
}
```

### Error Handling
Always use try-catch in async functions:
```typescript
const loadData = async () => {
  try {
    setState(prev => ({ ...prev, loading: true, error: null }));
    const data = await apiCall();
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

### Backend Endpoints
- Base URL: `http://localhost:3010`
- Positions: 
  - `/position/:id/interviewflow` - Get interview flow
  - `/position/:id/candidates` - Get candidates list
- Candidates: 
  - `PUT /candidates/:id` - Update stage
    - Body: `{ applicationId: number, currentInterviewStep: number }`

## Accessibility

- Maintain color contrast ratio ≥ 4.5:1 (WCAG AA)
- Keyboard navigation must work:
  - Tab: Move between elements
  - Enter/Space: Activate drag mode (via @dnd-kit)
  - Arrow keys: Move between columns
  - Escape: Cancel drag
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add `aria-label` when text is not visible
- Screen reader text with `visually-hidden` class:
```tsx
<span className="visually-hidden">Cargando...</span>
```

## Performance

- Avoid unnecessary re-renders (use React.memo when needed)
- Keep components small and focused (< 200 lines)
- Use `key` prop in lists (unique, stable IDs)
- Lazy load routes if needed: `const Component = React.lazy(() => import('./Component'))`
- Check bundle size impact before adding dependencies

## Commit Message Format

Use conventional commits:

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactor
- style: Formatting
- test: Tests

Examples:
- feat(kanban): add drag & drop functionality
- fix(api): handle 404 errors in position service
- docs(architecture): add component diagram
```

## Don'ts (Things to Avoid)

- ❌ NO use `any` type (use explicit types or `unknown`)
- ❌ NO mutate state directly (always create new object/array)
- ❌ NO use class components (use functional + hooks)
- ❌ NO call hooks after early returns or inside conditionals (violates Rules of Hooks)
- ❌ NO inline complex logic in JSX (extract to functions)
- ❌ NO forget error handling in async functions
- ❌ NO hardcode URLs in components (use service layer)
- ❌ NO skip loading/error/empty states
- ❌ NO use deprecated packages (check npm audit)
- ❌ NO use axios (use native fetch instead)

## Project-Specific Context

### Current Features
- Position Kanban with drag & drop (@dnd-kit/core)
- Candidate management with score badges
- Interview flow visualization
- Responsive design (mobile/tablet/desktop)
- Optimistic UI updates with rollback

### Known Issues
- Toast notifications not implemented (uses `alert()`)
- No batch candidate updates
- Accessibility at 95% (missing: live regions, reduced motion CSS)
- Position page UI limited to 3-4 interview steps

### Dependencies Policy

**Approved Libraries:**
- `@dnd-kit/core` - Drag & drop (accessible, React 18 compatible)
- `@dnd-kit/utilities` - DnD utilities
- `react-bootstrap` - UI components
- `react-router-dom` - Routing

**Before Adding New Dependency:**
1. Check if native/built-in alternative exists (e.g., fetch over axios)
2. Verify bundle size impact (reject if > 50KB gzipped)
3. Check maintenance status (last update, open issues)
4. Prefer dependencies already in use

### Documentation

Comprehensive docs in `frontend/docs/`:
- `phase-0-setup.md` - Setup and environment
- `phase-1-analysis.md` - Codebase structure analysis
- `architecture-position-page.md` - Component architecture
- `api-flow-analysis.md` - Backend API integration
- `kanban-design-decisions.md` - UX/UI decisions
- `integration-plan.md` - Implementation details
- `responsiveness-ux.md` - Responsive design & UX
- `checklist-final.md` - QA checklist

Additional:
- `frontend/prompts/prompts-iniciales.md` - AI assistant guide with reusable prompts

## When Helping

1. Ask clarifying questions if requirements unclear
2. Suggest simplest solution first (KISS principle)
3. Explain trade-offs of different approaches
4. Reference these rules when making decisions
5. Propose code that matches existing patterns
6. Consider mobile/responsive in all implementations
7. Include TypeScript types in all code suggestions
8. Show error handling in examples
9. Always include loading/error/empty states
10. Keep explanations concise but complete

