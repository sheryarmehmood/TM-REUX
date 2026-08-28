# TM-REUX — Project Structure, Current State & Implementation Plan

## 1. Project Overview

**Project:** TM-REUX  
**Backend:** Laravel  
**Frontend:** React + Vite  
**State Management:** Redux Toolkit + React Redux  
**Routing:** React Router  
**Database:** MySQL (XAMPP)  
**Environment:** Windows

Project root:

```text
D:\TM-REUX
├── BE    # Laravel backend
└── FE    # React frontend
```

---

## 2. Current Environment

```text
PHP       8.2.12
Composer  2.8.11
Node      20.19.0
npm       10.8.2
Git       2.43.0
```

XAMPP is installed and provides the local MySQL environment.

Development URLs:

```text
Laravel: http://127.0.0.1:8000
React:   http://localhost:5173
```

---

## 3. Completed Setup

### Backend

Created with:

```powershell
cd D:\
mkdir TM-REUX
cd TM-REUX
composer create-project laravel/laravel BE
cd BE
php artisan --version
php artisan serve
```

Database configuration and migrations have been completed and verified.

### Frontend

React/Vite frontend was created and the following packages were installed:

```text
react-router-dom
@reduxjs/toolkit
react-redux
```

Frontend runs with:

```powershell
npm run dev
```

---

# 4. Current Architecture

```text
                    TM-REUX
                       |
          +------------+------------+
          |                         |
         FE                        BE
       React                    Laravel
          |                         |
     React Router              REST API
          |                         |
     Redux Toolkit             MySQL
          |                         |
          +---------- API ----------+
```

Frontend and backend are separate applications.

---

# 5. Intended Frontend Structure

```text
FE/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── store.js
│   │   └── router.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── Button.jsx
│   │   │
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── features/
│   │   └── app/
│   │       └── appSlice.js
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Login/
│   │   │   └── Login.jsx
│   │   └── NotFound/
│   │       └── NotFound.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

The coding agent should inspect the actual project before changing files because some of these files may already exist.

---

# 6. Folder Responsibilities

## `src/app/`

Application-level configuration:

- Redux store
- React Router configuration

## `src/components/`

Reusable UI components such as:

- Navbar
- Sidebar
- Button
- Modal
- Input
- Table
- Loader

## `src/components/layout/`

Shared application layout:

```text
MainLayout
├── Navbar
├── Sidebar
└── Outlet
```

## `src/pages/`

Complete screens/pages:

- Login
- Dashboard
- Profile
- Settings
- Projects
- Tasks

## `src/features/`

Feature-specific Redux/business logic:

```text
features/
├── app/
├── auth/
├── users/
├── projects/
└── tasks/
```

## `src/services/`

Centralized API communication. Components should not repeatedly hard-code API URLs.

---

# 7. Current Redux Implementation

Redux Toolkit and React Redux are installed.

Current state:

```text
Redux Store
└── app
    ├── sidebarOpen
    ├── theme
    └── notification
```

Current `appSlice` actions:

```text
toggleSidebar
setTheme
setNotification
clearNotification
```

Example state:

```javascript
{
    sidebarOpen: true,
    theme: "light",
    notification: "Welcome to TM-REUX!"
}
```

---

# 8. Redux Concepts Demonstrated

The current implementation demonstrates:

- Store — central Redux state
- Slice — a section of state
- State — current application values
- Action — describes what should happen
- Reducer — changes state in response to actions
- `dispatch()` — sends actions to Redux
- `useSelector()` — reads Redux state

Example:

```javascript
dispatch(toggleSidebar());
```

and:

```javascript
const theme = useSelector(state => state.app.theme);
```

---

# 9. Current Redux UI Demonstration

### Sidebar

```text
true  -> sidebar visible
false -> sidebar hidden
```

### Theme

```text
light -> dark
 dark -> light
```

### Notification

The UI can dispatch `setNotification()` and `clearNotification()` and immediately display the updated value.

The current implementation also logs the app slice in the browser console for learning/debugging.

Production implementation should prefer Redux DevTools and remove unnecessary manual logging.

---

# 10. Current React Router Architecture

Intended routes:

```text
/       -> MainLayout -> Dashboard
/login  -> Login
```

Unknown routes should show `NotFound`.

`MainLayout` should use React Router's `<Outlet />` so common layout components remain persistent while the page changes.

---

# 11. Current API Test

A basic Laravel endpoint was created and verified:

```text
GET /api/test
```

Expected response:

```json
{
    "success": true,
    "message": "Laravel API is working!"
}
```

React successfully called the Laravel endpoint and displayed the response.

Therefore this basic flow is verified:

```text
React -> Laravel -> JSON -> React
```

---

# 12. Important Architectural Rule

Do **not** put the complete application UI inside `App.jsx`.

`App.jsx` should remain small. Use:

```text
Router
Layouts
Pages
Components
Features
Services
Redux
```

for their respective responsibilities.

---

# 13. Authentication — Remaining

Authentication has not yet been implemented.

Implement:

```text
Laravel authentication
React login form
authSlice
login API
logout API
current-user API
authentication persistence
protected routes
guest routes
```

Laravel Sanctum/session-based SPA authentication should be evaluated and configured securely.

---

# 14. `authSlice` — Remaining

Recommended structure:

```text
features/
└── auth/
    ├── authSlice.js
    ├── authApi.js
    └── authSelectors.js
```

Target state:

```javascript
{
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
}
```

Do not store passwords in Redux.

---

# 15. Authentication Flow

```text
Login.jsx
   |
   | email/password
   v
Auth API
   |
   v
Laravel
   |
   v
Validate credentials
   |
   v
MySQL
   |
   v
Authentication response
   |
   v
Redux auth state
   |
   +--> user
   +--> isAuthenticated
   +--> loading/error
```

After successful login, redirect to the dashboard.

Unauthenticated users attempting protected routes should be redirected to `/login`.

Authenticated users visiting `/login` should be redirected to the dashboard.

---

# 16. Central API Client — Remaining

Create:

```text
FE/src/services/api.js
```

Use an environment variable such as:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Do not hard-code production API URLs inside components.

A centralized API client should handle common configuration and error handling.

---

# 17. CORS — Remaining

Frontend and backend currently run on different origins:

```text
http://localhost:5173
http://127.0.0.1:8000
```

Configure Laravel CORS correctly for the frontend origin.

Do not broadly disable security controls.

---

# 18. Backend Architecture

Keep Laravel organized approximately as:

```text
BE/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   └── Services/
│
├── routes/
│   ├── api.php
│   └── web.php
│
└── database/
    ├── migrations/
    └── seeders/
```

Guidelines:

- Keep controllers thin.
- Use Form Request classes for validation.
- Use API Resources for consistent API output where useful.
- Put substantial business logic into service classes.
- Use Eloquent models and relationships.
- Use migrations for database changes.
- Add policies/authorization for protected resources.

---

# 19. API Response Convention

Use a consistent JSON structure.

Success:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

Error:

```json
{
    "success": false,
    "message": "Operation failed",
    "errors": {}
}
```

Keep API responses consistent across endpoints.

---

# 20. RTK Query

Use RTK Query for appropriate server/API state instead of manually duplicating loading/data/error logic across many Redux slices.

Potential future structure:

```text
features/
├── auth/
│   └── authSlice.js
├── projects/
│   └── projectApi.js
└── tasks/
    └── taskApi.js
```

Normal Redux slices are appropriate for client/application state such as:

- theme
- sidebar state
- UI state
- authentication-related client state

RTK Query is appropriate for server state such as:

- projects
- tasks
- users
- API data
- caching/refetching

---

# 21. UI/UX Requirements

The final application should have:

- Responsive layout
- Professional navbar
- Responsive sidebar
- Login page
- Dashboard
- Loading indicators
- Error states
- Empty states
- Form validation
- Reusable UI components
- Success/error notifications
- Accessible form labels and controls
- Consistent styling

Avoid excessive inline JSX styling as the application grows.

---

# 22. Error Handling

Handle at least:

```text
400
401
403
404
422
429
500
network errors
```

Examples:

```text
401 -> login/unauthenticated handling
422 -> validation errors
500 -> friendly server error
network error -> connection error UI
```

Do not expose sensitive server/debug details to users.

---

# 23. Loading States

All asynchronous operations need appropriate loading UI.

For example:

```text
Login
  |
  v
Loading...
  |
  +--> Success
  |
  +--> Error
```

Disable duplicate submissions while requests are in progress.

---

# 24. Security Requirements

Never:

- Store passwords in Redux.
- Put private API keys/secrets in React `VITE_*` variables.
- Commit `.env` files containing secrets.
- Hard-code private credentials.
- Trust frontend validation alone.
- Bypass backend authorization.

Backend validation and authorization are authoritative.

---

# 25. Git Requirements

Git should be initialized at:

```text
D:\TM-REUX
```

`.gitignore` should exclude:

```text
.env
node_modules/
vendor/
logs
build artifacts
local/generated files
```

Never commit secrets.

---

# 26. Coding Agent Instructions

Before changing anything, the coding agent MUST:

1. Inspect the existing project files.
2. Confirm which files/features already exist.
3. Preserve working functionality.
4. Do not recreate the project from scratch.
5. Do not delete migrations/configuration without a valid reason.
6. Keep FE and BE separated.
7. Follow the architecture in this document.
8. Avoid unnecessary dependencies.
9. Use Redux Toolkit correctly.
10. Use React Router correctly.
11. Use RTK Query where appropriate for server state.
12. Use a centralized API client.
13. Use environment variables for API URLs.
14. Implement authentication securely.
15. Add proper loading/error states.
16. Keep Laravel controllers clean.
17. Use Form Requests for validation.
18. Use API Resources where appropriate.
19. Add authorization/policies for protected resources.
20. Test the application after major changes.
21. Fix root causes instead of bypassing errors.
22. Do not expose secrets.

---

# 27. Recommended Implementation Order

## Phase 1 — Frontend architecture

Verify and finalize:

```text
Router
MainLayout
Navbar
Sidebar
Pages
Redux Store
appSlice
```

Remove unnecessary demo code from `App.jsx`.

## Phase 2 — API client

Implement:

```text
services/api.js
.env
VITE_API_URL
```

## Phase 3 — Laravel authentication

Implement:

```text
Sanctum/session authentication
login
logout
current user
CORS
```

## Phase 4 — React authentication

Implement:

```text
Login page
authSlice
protected routes
guest routes
logout
current user
loading/error handling
```

## Phase 5 — Dashboard

Create a real dashboard consuming backend data rather than hard-coded demo data.

## Phase 6 — Reusable UI

Add reusable components only where useful:

```text
Button
Input
Modal
Alert/Notification
Loader
Card
Table
```

## Phase 7 — Business Features

For each actual TM-REUX feature, implement the complete stack:

```text
React page
React components
API integration
Redux/RTK Query if appropriate
Laravel route
Controller
Request validation
Service if needed
Model
Migration
API Resource
Authorization
```

## Phase 8 — Testing and production readiness

Test:

```text
Authentication
Routing
API requests
Validation
Authorization
CRUD operations
Error handling
Responsive UI
```

Then prepare production configuration and deployment.

---

# 28. Final Target Architecture

```text
TM-REUX
│
├── FE
│   ├── app
│   │   ├── store.js
│   │   └── router.jsx
│   │
│   ├── components
│   │   ├── common
│   │   └── layout
│   │
│   ├── features
│   │   ├── app
│   │   ├── auth
│   │   ├── users
│   │   ├── projects
│   │   └── tasks
│   │
│   ├── pages
│   │   ├── Login
│   │   ├── Dashboard
│   │   ├── Profile
│   │   ├── Projects
│   │   └── Tasks
│   │
│   └── services
│       └── api.js
│
└── BE
    ├── Controllers
    ├── Requests
    ├── Resources
    ├── Models
    ├── Services
    ├── Policies
    ├── Migrations
    └── routes/api.php
```

---

# 29. Status Summary

## Completed

- [x] Project root created
- [x] Laravel backend created
- [x] Laravel backend runs
- [x] Database migration verified
- [x] React/Vite frontend created
- [x] React frontend runs
- [x] React Router installed
- [x] Redux Toolkit installed
- [x] React Redux installed
- [x] Laravel API test endpoint verified
- [x] React -> Laravel -> JSON communication verified
- [x] Redux store created
- [x] `appSlice` created
- [x] Sidebar Redux state
- [x] Theme Redux state
- [x] Notification Redux state
- [x] Redux state visible in UI
- [x] Redux state logged in browser console
- [x] Professional page/component/router architecture designed

## Remaining

- [ ] Finalize actual frontend architecture in the codebase
- [ ] Central API client
- [ ] Environment configuration
- [ ] Laravel authentication
- [ ] Sanctum/session setup
- [ ] `authSlice`
- [ ] Login
- [ ] Logout
- [ ] Current-user handling
- [ ] Protected routes
- [ ] Guest routes
- [ ] Proper error handling
- [ ] Loading states
- [ ] Reusable UI components
- [ ] RTK Query/API data layer where appropriate
- [ ] Actual TM-REUX business features
- [ ] Backend CRUD APIs
- [ ] Authorization/policies
- [ ] Testing
- [ ] Production configuration
- [ ] Deployment

---

# 30. Final Instruction

This document describes the current project direction and intended architecture.

The coding agent should **inspect the actual code first**, then implement the remaining work incrementally.

Do not blindly create duplicate files or overwrite working implementations.

The goal is a maintainable, production-quality Laravel + React application with a clean separation between:

```text
UI
Pages
Components
Layouts
Routing
Redux/client state
Server/API state
API services
Laravel backend
Database
Authentication
Authorization
```
