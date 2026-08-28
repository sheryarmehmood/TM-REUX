# TM-REUX Implementation Documentation

## 1. Purpose

This document defines the implementation approach for TM-REUX, a project and task management application with a Laravel REST API backend and a React frontend.

It is based on the current repository state and should be updated when product decisions change.

## 2. Current Repository State

### Implemented

- Laravel 12 backend in `BE/`.
- React 19 and Vite frontend in `FE/`.
- React Router and Redux Toolkit installed.
- Basic nested frontend layout with navbar, sidebar, dashboard, login placeholder, and not-found page.
- Laravel `GET /api/test` endpoint.
- Sanctum-protected `GET /api/user` route scaffold.
- Basic Redux application state for sidebar, theme, and notifications.
- Default Laravel user, session, cache, queue, and Sanctum migrations.

### Not implemented

- ~~Authentication endpoints and frontend authentication flow.~~ Completed in Phase 3 and Phase 4.
- ~~Centralized frontend API client.~~ Completed in Phase 2.
- ~~Route guards and authentication persistence.~~ Completed in Phase 4 using Sanctum cookies and Redux Toolkit auth state.
- ~~Project and task models, migrations, APIs, and policies.~~ Completed for the owner-scoped MVP in Phase 5 and Phase 6.
- Real dashboard data.
- Reusable production UI components.
- Feature-level frontend tests.
- Domain-specific backend tests.

### Baseline verification

- Laravel baseline tests pass.
- Frontend production build passes.
- Existing tests are scaffold tests and do not yet verify application requirements.

### Requested implementation status

| Requirement | Status | Implementation |
| --- | --- | --- |
| Authentication endpoints and frontend flow | Complete | Sanctum session login, logout, current-user endpoint, Redux Toolkit auth slice, and controlled login form |
| Centralized frontend API client | Complete | `FE/src/services/api.js` and RTK Query base API |
| Route guards and auth persistence | Complete | Protected/guest routes plus current-user bootstrap using HttpOnly session cookies |
| Project/task models and migrations | Complete | Owner-scoped `Project` and `Task` models with foreign keys and indexes |
| Project/task APIs | Complete | Authenticated CRUD endpoints, nested project task endpoints, validation, resources, and pagination |
| Project/task policies | Complete | Owner authorization for projects and their tasks |
| Simple registration | Complete | Guest registration page, Redux Toolkit registration thunk, Laravel validation, and automatic login after registration |
| Simple project/task workflow | Complete | Dashboard summary, project create/edit/delete, task create/status/delete, and RTK Query cache invalidation |

The current policy implementation is intentionally owner-scoped. Project membership and role-based access remain a later extension.

For the first release, no additional product decisions are required. The MVP uses one owner per project, no teams or administrator roles, and tasks scoped to their project. Profile/settings, team membership, attachments, comments, notifications, and a global cross-project task view are intentionally deferred.

Registration flow:

```text
/login -> Don't have an account? Sign up -> /register
/register -> POST /api/register -> authenticated session -> /
```

## 3. Target Architecture

```text
TM-REUX/
├── BE/                         Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Http/Requests/
│   │   ├── Http/Resources/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   ├── database/migrations/
│   ├── database/seeders/
│   └── routes/api.php
│
└── FE/                         React SPA
    └── src/
        ├── app/                Store and router
        ├── components/         Shared UI and layout
        ├── features/           Feature state and RTK Query APIs
        ├── pages/              Route-level screens
        └── services/           HTTP client and API utilities
```

### State ownership

Use normal Redux slices for client state:

- Authentication session state.
- Theme.
- Sidebar visibility.
- Notifications.
- Local UI state that must be shared across components.

Use RTK Query for server state:

- Projects.
- Tasks.
- Users and project members.
- Cached API responses.
- Loading, error, invalidation, and refetch behavior.

Do not duplicate API loading and error logic in multiple unrelated slices.

## 4. Product Rules Required Before Domain Work

Before implementing projects and tasks, confirm these rules:

- A project has one owner.
- A project can have multiple members, or ownership is exclusive.
- Tasks belong to exactly one project.
- Tasks may optionally be assigned to a user.
- Which users can view, edit, archive, or delete a project.
- Which users can create, update, assign, or delete tasks.
- Whether administrators are required in the first release.
- Required task statuses and allowed status transitions.

Recommended MVP defaults:

- A user owns many projects.
- A project has many tasks.
- A project has many members through a membership table.
- Owners can manage the project and its members.
- Members can view the project and manage permitted tasks.
- Tasks have `todo`, `in_progress`, and `done` statuses.
- Tasks have `low`, `medium`, and `high` priorities.

## 5. Development Environment

Recommended local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
API:      http://localhost:8000/api
```

Use `localhost` consistently for both applications. Avoid mixing `localhost` and `127.0.0.1` during cookie-based authentication.

### Backend setup

```powershell
cd D:\TM-REUX\BE
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=localhost --port=8000
```

Configure the selected database in `.env`. The repository currently defaults to SQLite while the project plan describes MySQL/XAMPP. Choose one development database and document it consistently.

### Frontend setup

```powershell
cd D:\TM-REUX\FE
npm install
npm run dev
```

Create `FE/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Never place private keys or backend secrets in `VITE_*` variables.

## 6. Implementation Phases

### Phase 1: Frontend application shell

Complete the existing shell before adding business screens.

Tasks:

- Finalize the router and nested layout.
- Replace raw sidebar anchors with React Router links.
- Add route-level `ProtectedRoute` and `GuestRoute` extension points.
- Apply the selected theme to the document.
- Add responsive sidebar behavior.
- Replace demo-only controls with reusable accessible components.
- Keep `App.jsx` minimal.

Target routes:

```text
/login
/
/projects
/projects/:projectId
/tasks
/profile
/settings
*
```

Acceptance criteria:

- Navigation does not cause full-page reloads.
- Unknown routes render the not-found screen.
- Layout components remain mounted while child pages change.
- The shell works on desktop and mobile widths.

### Phase 2: Central API client

Create `FE/src/services/api.js`.

Responsibilities:

- Read the base URL from `VITE_API_URL`.
- Send JSON requests.
- Include credentials for Sanctum cookies.
- Parse successful and failed responses consistently.
- Normalize validation and network errors.
- Avoid exposing server debug details to users.

Recommended normalized error shape:

```javascript
{
    status: 422,
    message: "The given data was invalid.",
    errors: {
        email: ["The email field is required."]
    }
}
```

### Phase 3: Laravel Sanctum authentication

Use cookie-based Sanctum authentication for the first-party React SPA.

Backend tasks:

- Enable Sanctum stateful API middleware in `BE/bootstrap/app.php`.
- Configure CORS for `http://localhost:5173`.
- Configure Sanctum stateful domains.
- Confirm session storage and CSRF settings.
- Add an authentication controller.
- Add a login Form Request.
- Add rate limiting to login requests.
- Return a stable user response shape.

Endpoints:

```text
GET  /sanctum/csrf-cookie
POST /api/login
POST /api/logout
GET  /api/user
```

Login request:

```json
{
  "email": "test@example.com",
  "password": "password"
}
```

Successful login response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

Authentication tests must cover:

- Valid login.
- Invalid credentials.
- Missing fields.
- Invalid email format.
- Authenticated current-user response.
- Unauthenticated current-user response.
- Logout.
- Login throttling.

### Phase 4: Frontend authentication

Create:

```text
FE/src/features/auth/authSlice.js
FE/src/features/auth/authApi.js
FE/src/features/auth/authSelectors.js
FE/src/components/routing/ProtectedRoute.jsx
FE/src/components/routing/GuestRoute.jsx
```

Auth state:

```javascript
{
    user: null,
    status: "idle",
    error: null,
    initialized: false
}
```

Implement:

- Controlled login fields.
- Accessible labels and form errors.
- Disabled submit state while logging in.
- CSRF initialization before login.
- Current-user bootstrap when the application starts.
- Logout.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users away from `/login`.
- Preserve the originally requested protected URL.

Passwords must never be stored in Redux, local storage, or frontend logs.

### Phase 5: Project backend

Create:

```text
BE/app/Models/Project.php
BE/app/Http/Controllers/ProjectController.php
BE/app/Http/Requests/StoreProjectRequest.php
BE/app/Http/Requests/UpdateProjectRequest.php
BE/app/Http/Resources/ProjectResource.php
BE/app/Policies/ProjectPolicy.php
BE/database/migrations/*_create_projects_table.php
```

Initial schema:

```text
projects
- id
- owner_id
- name
- description nullable
- status
- timestamps
```

Recommended indexes and constraints:

- Foreign key from `owner_id` to `users.id`.
- Index `owner_id`.
- Index `status` if filtering is required.
- Use a deliberate delete strategy for owned projects and their tasks.

Endpoints:

```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/{project}
PUT    /api/projects/{project}
DELETE /api/projects/{project}
```

Requirements:

- All endpoints require authentication.
- All mutations use Form Requests.
- Responses use an API Resource.
- Policies enforce ownership or membership.
- List endpoints use pagination.
- Cross-user access returns `403` or `404` according to the chosen resource exposure policy.

### Phase 6: Task backend

Create:

```text
BE/app/Models/Task.php
BE/app/Http/Controllers/TaskController.php
BE/app/Http/Requests/StoreTaskRequest.php
BE/app/Http/Requests/UpdateTaskRequest.php
BE/app/Http/Resources/TaskResource.php
BE/app/Policies/TaskPolicy.php
BE/database/migrations/*_create_tasks_table.php
```

Initial schema:

```text
tasks
- id
- project_id
- assignee_id nullable
- title
- description nullable
- status
- priority
- due_date nullable
- timestamps
```

Endpoints:

```text
GET    /api/projects/{project}/tasks
POST   /api/projects/{project}/tasks
GET    /api/tasks/{task}
PUT    /api/tasks/{task}
DELETE /api/tasks/{task}
```

Requirements:

- Tasks are always scoped to an accessible project.
- Assignees must be valid project members.
- Status and priority values are validated server-side.
- Authorization is checked for every read and mutation.
- Tests cover invalid project access and assignment rules.

### Phase 7: Frontend projects and tasks

Create RTK Query APIs:

```text
FE/src/features/projects/projectApi.js
FE/src/features/tasks/taskApi.js
```

Create pages and components for:

- Project list.
- Project creation.
- Project editing.
- Project details.
- Task list.
- Task creation and editing.
- Task filters and status changes.

Every asynchronous screen must provide:

- Loading state.
- Empty state.
- Success state.
- Validation error state.
- Permission error state.
- Network/server error state.
- Retry or recovery action where appropriate.

### Phase 8: Dashboard and supporting pages

Replace the Redux demonstration content in the current dashboard with real data.

Dashboard sections may include:

- Number of active projects.
- Open tasks.
- Tasks due soon.
- Recently updated projects.
- Recent task activity.

Then add:

- Profile page.
- Settings page.
- Project member management if required by the product rules.

## 7. API Response Convention

Success response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Collection response:

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [],
  "meta": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {}
}
```

Required status behavior:

```text
400  malformed or invalid request
401  unauthenticated
403  authenticated but unauthorized
404  resource not found
422  validation failure
429  rate limit exceeded
500  unexpected server failure
```

## 8. Testing Strategy

### Backend

Use Laravel feature tests with database refresh support.

Test:

- Authentication.
- Project CRUD.
- Task CRUD.
- Validation.
- Authorization.
- Relationships.
- Pagination and filters.
- Standard response formats.

### Frontend

Add a frontend test tool before writing component tests, such as Vitest and React Testing Library.

Test:

- Route guards.
- Login success and failure.
- Current-user initialization.
- Logout.
- Loading and empty states.
- API validation errors.
- Project and task interactions.

### Manual verification

Verify at desktop and mobile widths:

- Login.
- Logout.
- Direct navigation to protected routes.
- Refresh while authenticated.
- Refresh while unauthenticated.
- Project creation and editing.
- Task creation, assignment, filtering, and completion.
- Permission failures.
- Network/server failure messages.

## 9. Security Requirements

- Do not store passwords in Redux or browser storage.
- Do not commit `.env` files or credentials.
- Treat backend validation as authoritative.
- Enforce authorization through Laravel policies.
- Use CSRF protection for cookie-based authentication.
- Restrict CORS to known frontend origins.
- Rate-limit login and other sensitive endpoints.
- Do not return stack traces or database details in production responses.
- Use HTTPS and secure cookie settings in production.
- Validate file uploads and user-provided content if those features are added.

## 10. Repository Hygiene

The repository should have a root-level `.gitignore` covering:

```text
.env
.env.*
node_modules/
vendor/
FE/dist/
BE/storage/logs/
BE/storage/framework/cache/
BE/storage/framework/sessions/
BE/storage/framework/views/
```

Initialize Git at `D:\TM-REUX` if source control is required. Do not commit generated dependencies, build output, local databases, or secrets.

## 11. Definition Of Done

The first complete release is ready when:

- Users can log in and log out securely.
- Protected routes cannot be accessed without authentication.
- Authenticated sessions survive page refreshes.
- Users can create, view, update, and delete permitted projects.
- Users can create, view, update, assign, and complete permitted tasks.
- Unauthorized cross-user access is rejected by the backend.
- All important asynchronous states are visible in the UI.
- API responses follow the documented convention.
- Backend feature tests cover authentication, validation, CRUD, and authorization.
- Frontend tests cover routing, authentication, and key workflows.
- The application builds successfully and runs from documented setup steps.
- Development database, CORS, session, and environment settings are documented and consistent.
