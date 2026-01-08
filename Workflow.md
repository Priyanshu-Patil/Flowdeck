# Flowdeck Application Workflow Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Design](#database-design)
4. [Authentication & Authorization](#authentication--authorization)
5. [Backend Workflow](#backend-workflow)
6. [Frontend Workflow](#frontend-workflow)
7. [API Endpoints](#api-endpoints)
8. [Background Jobs & Event Processing](#background-jobs--event-processing)
9. [User Flows](#user-flows)
10. [Data Flow](#data-flow)
11. [Technology Stack](#technology-stack)

---

## Overview

**Flowdeck** is a project management application that enables teams to organize workspaces, manage projects, assign tasks, and collaborate effectively. The application follows a modern full-stack architecture with a React frontend, Express.js backend, PostgreSQL database, and Clerk for authentication.

### Key Features
- **Workspace Management**: Create and manage multiple workspaces
- **Project Management**: Organize projects within workspaces with status tracking
- **Task Management**: Create, assign, and track tasks with priorities and due dates
- **Team Collaboration**: Add members to workspaces and projects
- **Comments**: Add comments to tasks for collaboration
- **Email Notifications**: Automated email notifications for task assignments and reminders
- **Analytics**: Project analytics and task tracking
- **Calendar View**: Visual calendar representation of tasks

---

## Architecture

### System Architecture

```
┌─────────────────┐
│   React Client  │  (Frontend - Vite + React)
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/REST API
         │ (Clerk Auth Token)
         ▼
┌─────────────────┐
│  Express Server │  (Backend - Node.js + Express)
│   (Port 3000)   │
└────────┬────────┘
         │
         ├─────────────────┬──────────────────┐
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Clerk     │  │   Inngest    │
│   Database   │  │  (Auth)      │  │ (Background) │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Directory Structure

```
Flowdeck/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── components/    # React components
│   │   ├── configs/       # API configuration
│   │   ├── features/     # Redux slices
│   │   ├── pages/         # Route pages
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                 # Backend Express Application
    ├── configs/           # Database & email configs
    ├── controllers/       # Business logic
    ├── routes/            # API routes
    ├── middlewares/       # Auth middleware
    ├── inngest/           # Background job functions
    ├── prisma/            # Database schema
    └── server.js          # Entry point
```

---

## Database Design

### Entity Relationship Diagram

```
User
├── id (String, PK)
├── name (String)
├── email (String, Unique)
├── image (String)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Workspace
├── id (String, PK)
├── name (String)
├── slug (String, Unique)
├── description (String?)
├── settings (JSON)
├── ownerId (String, FK → User.id)
├── image_url (String)
├── createdAt (DateTime)
└── updatedAt (DateTime)

WorkspaceMember (Junction Table)
├── id (String, PK)
├── userId (String, FK → User.id)
├── workspaceId (String, FK → Workspace.id)
├── role (WorkspaceRole: ADMIN | MEMBER)
└── message (String)

Project
├── id (String, PK)
├── name (String)
├── description (String?)
├── priority (Priority: LOW | MEDIUM | HIGH)
├── status (ProjectStatus: ACTIVE | PLANNING | COMPLETED | ON_HOLD | CANCELLED)
├── start_date (DateTime?)
├── end_date (DateTime?)
├── team_lead (String, FK → User.id)
├── workspaceId (String, FK → Workspace.id)
├── progress (Int, 0-100)
├── createdAt (DateTime)
└── updatedAt (DateTime)

ProjectMember (Junction Table)
├── id (String, PK)
├── userId (String, FK → User.id)
└── projectId (String, FK → Project.id)

Task
├── id (String, PK)
├── projectId (String, FK → Project.id)
├── title (String)
├── description (String?)
├── status (TaskStatus: TODO | IN_PROGRESS | DONE)
├── type (TaskType: TASK | BUG | FEATURE | IMPROVEMENT | OTHER)
├── priority (Priority: LOW | MEDIUM | HIGH)
├── assigneeId (String, FK → User.id)
├── due_date (DateTime)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Comment
├── id (String, PK)
├── content (String)
├── userId (String, FK → User.id)
├── taskId (String, FK → Task.id)
└── createdAt (DateTime)
```

### Relationships

- **User ↔ Workspace**: Many-to-Many (via WorkspaceMember)
- **User ↔ Project**: Many-to-Many (via ProjectMember)
- **User → Project**: One-to-Many (as owner/team_lead)
- **User → Task**: One-to-Many (as assignee)
- **User → Comment**: One-to-Many
- **Workspace → Project**: One-to-Many
- **Project → Task**: One-to-Many
- **Task → Comment**: One-to-Many

### Enums

```prisma
WorkspaceRole: ADMIN | MEMBER
TaskStatus: TODO | IN_PROGRESS | DONE
TaskType: TASK | BUG | FEATURE | IMPROVEMENT | OTHER
ProjectStatus: ACTIVE | PLANNING | COMPLETED | ON_HOLD | CANCELLED
Priority: LOW | MEDIUM | HIGH
```

---

## Authentication & Authorization

### Authentication Flow

1. **User Authentication**: Handled by Clerk
   - User signs in via Clerk's authentication UI
   - Clerk provides JWT tokens for API requests
   - Frontend stores authentication state via `@clerk/clerk-react`

2. **Token Validation**: 
   - Every API request includes `Authorization: Bearer <token>` header
   - Backend middleware (`authMiddlewares.js`) validates token using `@clerk/express`
   - Extracts `userId` from validated token

### Authorization Rules

#### Workspace Level
- **ADMIN**: Can create projects, add/remove members, update workspace
- **MEMBER**: Can view workspace and projects, add comments

#### Project Level
- **Project Owner (team_lead)**: Can create/update/delete tasks, add project members
- **Project Members**: Can view tasks, add comments
- **Workspace ADMIN**: Can create/update projects, override project permissions

#### Task Level
- **Project Owner**: Can create/update/delete tasks
- **Task Assignee**: Can update their own tasks (status, etc.)
- **Project Members**: Can add comments to tasks

### Middleware Flow

```javascript
Request → clerkMiddleware() → protect() → Route Handler
         (Clerk setup)      (Auth check)  (Business logic)
```

---

## Backend Workflow

### Server Initialization (`server.js`)

1. **Express App Setup**
   - Configure CORS for cross-origin requests
   - Enable JSON body parsing
   - Initialize Clerk middleware

2. **Database Connection**
   - Prisma Client initialization with PostgreSQL
   - Connection pooling via Neon serverless adapter

3. **Route Registration**
   - `/api/workspaces` → Workspace operations
   - `/api/projects` → Project operations
   - `/api/tasks` → Task operations
   - `/api/comments` → Comment operations
   - `/api/inngest` → Inngest webhook endpoint

4. **Server Start**
   - Listen on PORT (default: 3000)

### Request Processing Flow

```
1. HTTP Request arrives
   ↓
2. CORS middleware processes
   ↓
3. Clerk middleware extracts auth token
   ↓
4. protect() middleware validates userId
   ↓
5. Route handler executes business logic
   ↓
6. Prisma queries database
   ↓
7. Response sent to client
```

### Controller Pattern

Each controller follows this pattern:

```javascript
export const controllerFunction = async (req, res) => {
    try {
        // 1. Extract userId from auth token
        const {userId} = await req.auth();
        
        // 2. Validate input data
        // 3. Check permissions
        // 4. Perform database operations
        // 5. Return response
    } catch (error) {
        // Error handling
    }
}
```

### Key Controllers

#### Workspace Controller
- `getUserWorkspaces`: Fetches all workspaces user is member of (with nested projects, tasks, members)
- `addMember`: Adds member to workspace (ADMIN only)

#### Project Controller
- `createProject`: Creates new project (ADMIN only)
- `updateProject`: Updates project details (ADMIN or project owner)
- `addMember`: Adds member to project (project owner only)

#### Task Controller
- `createTask`: Creates task and triggers email notification
- `updateTask`: Updates task details
- `deleteTask`: Deletes task(s) (supports bulk deletion)

#### Comment Controller
- `addComment`: Adds comment to task (project members only)
- `getTaskComments`: Fetches all comments for a task

---

## Frontend Workflow

### Application Initialization (`main.jsx`)

1. **Root Setup**
   - React Router for navigation
   - ClerkProvider for authentication
   - Redux Provider for state management

2. **Entry Point**
   - Renders `<App />` component
   - Applies global CSS styles

### Routing Structure (`App.jsx`)

```
/ (Layout)
├── / (Dashboard)
├── /team (Team)
├── /projects (Projects List)
├── /projectsDetail?id=<id>&tab=<tab> (Project Details)
└── /taskDetails?id=<id> (Task Details)
```

### Layout Component (`Layout.jsx`)

**Initialization Flow:**

1. **Theme Loading**
   - Loads theme preference from localStorage
   - Applies dark/light mode

2. **Authentication Check**
   - If no user → Show Clerk SignIn component
   - If user exists → Continue

3. **Workspace Loading**
   - Fetches user's workspaces via Redux action
   - If no workspaces → Show CreateOrganization component
   - If workspaces exist → Load current workspace from localStorage or default to first

4. **UI Rendering**
   - Sidebar (collapsible)
   - Navbar
   - Outlet (renders child routes)

### State Management (Redux)

#### Store Structure

```javascript
{
    workspace: {
        workspaces: [],           // All user workspaces
        currentWorkspace: null,   // Currently selected workspace
        loading: boolean
    },
    theme: {
        // Theme preferences
    }
}
```

#### Workspace Slice Actions

- `fetchWorkspaces`: Async thunk to fetch workspaces from API
- `setCurrentWorkspace`: Sets active workspace (persists to localStorage)
- `addWorkspace`: Adds new workspace to state
- `updateWorkspace`: Updates workspace in state
- `addProject`: Adds project to current workspace
- `addTask`: Adds task to project
- `updateTask`: Updates task in state
- `deleteTask`: Removes task from state

### Component Hierarchy

```
Layout
├── Sidebar
│   ├── WorkspaceDropdown
│   ├── ProjectsSidebar
│   └── MyTasksSidebar
├── Navbar
└── Outlet (Page Content)
    ├── Dashboard
    │   ├── StatsGrid
    │   ├── ProjectOverview
    │   ├── RecentActivity
    │   └── TasksSummary
    ├── Projects
    │   └── ProjectCard (multiple)
    ├── ProjectDetails
    │   ├── ProjectTasks
    │   ├── ProjectAnalytics
    │   ├── ProjectCalendar
    │   └── ProjectSettings
    └── TaskDetails
```

### API Integration (`configs/api.js`)

- Axios instance configured with base URL from environment variables
- All requests include Clerk auth token in headers
- Token obtained via `getToken()` from Clerk's `useAuth()` hook

### Data Fetching Pattern

```javascript
// 1. Component mounts
useEffect(() => {
    // 2. Dispatch Redux action
    dispatch(fetchWorkspaces({getToken}))
}, [])

// 3. Redux thunk makes API call
const fetchWorkspaces = createAsyncThunk(async ({getToken}) => {
    const token = await getToken()
    const {data} = await api.get('/api/workspaces', {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data.workspaces
})

// 4. State updated, component re-renders
```

---

## API Endpoints

### Workspace Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/workspaces` | Get all workspaces for user | Yes |
| POST | `/api/workspaces/add-member` | Add member to workspace | Yes (ADMIN) |

**Request Body (add-member):**
```json
{
    "email": "user@example.com",
    "role": "ADMIN" | "MEMBER",
    "workspaceId": "workspace-id",
    "message": "Optional message"
}
```

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/projects` | Create new project | Yes (ADMIN) |
| PUT | `/api/projects` | Update project | Yes (ADMIN/Owner) |
| POST | `/api/projects/:projectId/addMember` | Add member to project | Yes (Owner) |

**Request Body (create):**
```json
{
    "workspaceId": "workspace-id",
    "name": "Project Name",
    "description": "Description",
    "status": "ACTIVE",
    "priority": "MEDIUM",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "team_lead": "user@example.com",
    "team_members": ["user1@example.com", "user2@example.com"],
    "progress": 0
}
```

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tasks` | Create new task | Yes (Project Owner) |
| PUT | `/api/tasks/:id` | Update task | Yes (Project Owner) |
| PUT | `/api/tasks/delete` | Delete task(s) | Yes (Project Owner) |

**Request Body (create):**
```json
{
    "projectId": "project-id",
    "title": "Task Title",
    "description": "Task description",
    "type": "TASK",
    "status": "TODO",
    "priority": "MEDIUM",
    "assigneeId": "user-id",
    "due_date": "2024-12-31"
}
```

**Request Body (delete):**
```json
{
    "taskIds": ["task-id-1", "task-id-2"]
}
```

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/comments` | Add comment to task | Yes (Project Member) |
| GET | `/api/comments/:taskId` | Get all comments for task | Yes |

**Request Body (add):**
```json
{
    "content": "Comment text",
    "taskId": "task-id"
}
```

---

## Background Jobs & Event Processing

### Inngest Integration

Inngest handles background jobs and event-driven workflows. The server exposes Inngest functions at `/api/inngest`.

### Event-Driven Functions

#### 1. User Synchronization

**Event: `clerk/user.created`**
- **Function**: `sync-user-from-clerk`
- **Action**: Creates user record in database when Clerk user is created
- **Data**: User ID, email, name, image URL

**Event: `clerk/user.updated`**
- **Function**: `update-user-from-clerk`
- **Action**: Updates user record when Clerk user is updated

**Event: `clerk/user.deleted`**
- **Function**: `delete-user-from-clerk`
- **Action**: Deletes user record from database

#### 2. Workspace Synchronization

**Event: `clerk/organization.created`**
- **Function**: `sync-workspace-from-clerk`
- **Action**: 
  - Creates workspace record
  - Adds creator as ADMIN member

**Event: `clerk/organization.updated`**
- **Function**: `update-workspace-from-clerk`
- **Action**: Updates workspace details

**Event: `clerk/organisation.deleted`**
- **Function**: `delete-workspace-from-clerk`
- **Action**: Deletes workspace (cascades to projects, tasks)

**Event: `clerk/organizationInvitation.accepted`**
- **Function**: `sync-workspace-member-from-clerk`
- **Action**: Creates WorkspaceMember record when invitation is accepted

#### 3. Task Email Notifications

**Event: `app/task.assigned`**
- **Function**: `send-task-assignment-mail`
- **Trigger**: When task is created via `taskController.createTask()`
- **Actions**:
  1. Fetches task details with assignee and project info
  2. Sends assignment email via Nodemailer
  3. If due date is in future:
     - Schedules sleep until due date
     - Checks if task is completed
     - If not completed, sends reminder email

**Email Service** (`configs/nodemailer.js`):
- Uses Brevo (formerly Sendinblue) SMTP relay
- Sends HTML formatted emails
- Includes task details and link to view task

### Event Flow

```
Task Created → inngest.send('app/task.assigned')
                ↓
        Inngest Function Executes
                ↓
        ┌───────────────────────┐
        │ Send Assignment Email │
        └───────────────────────┘
                ↓
        ┌───────────────────────┐
        │ Sleep Until Due Date  │
        └───────────────────────┘
                ↓
        ┌───────────────────────┐
        │ Check Task Status     │
        └───────────────────────┘
                ↓
        ┌───────────────────────┐
        │ Send Reminder (if not │
        │        completed)      │
        └───────────────────────┘
```

---

## User Flows

### 1. First-Time User Flow

```
1. User visits application
   ↓
2. Clerk SignIn component displayed
   ↓
3. User signs up/signs in
   ↓
4. Clerk creates user account
   ↓
5. Inngest syncs user to database (clerk/user.created)
   ↓
6. Layout checks for workspaces
   ↓
7. No workspaces found → CreateOrganization component shown
   ↓
8. User creates workspace
   ↓
9. Clerk creates organization
   ↓
10. Inngest syncs workspace (clerk/organization.created)
    ↓
11. Workspace loaded → Dashboard displayed
```

### 2. Project Creation Flow

```
1. User clicks "New Project" button
   ↓
2. CreateProjectDialog opens
   ↓
3. User fills form:
   - Project name, description
   - Status, priority
   - Start/end dates
   - Team lead (email)
   - Team members (emails)
   ↓
4. Form submitted → POST /api/projects
   ↓
5. Backend validates:
   - User is workspace ADMIN
   - Team lead exists
   - Team members are workspace members
   ↓
6. Project created in database
   ↓
7. Project members added
   ↓
8. Response returned with full project data
   ↓
9. Redux state updated (addProject action)
   ↓
10. UI updates to show new project
```

### 3. Task Creation Flow

```
1. User navigates to Project Details
   ↓
2. Clicks "New Task" button
   ↓
3. CreateTaskDialog opens
   ↓
4. User fills form:
   - Title, description
   - Type, status, priority
   - Assignee (from project members)
   - Due date
   ↓
5. Form submitted → POST /api/tasks
   ↓
6. Backend validates:
   - User is project owner
   - Assignee is project member
   ↓
7. Task created in database
   ↓
8. Inngest event triggered: 'app/task.assigned'
   ↓
9. Response returned with task data
   ↓
10. Redux state updated (addTask action)
    ↓
11. UI updates to show new task
    ↓
12. Background: Email sent to assignee
```

### 4. Task Comment Flow

```
1. User views task details
   ↓
2. User types comment and submits
   ↓
3. POST /api/comments
   ↓
4. Backend validates:
   - User is project member
   - Task exists
   ↓
5. Comment created in database
   ↓
6. Response returned with comment (including user info)
   ↓
7. UI updates to show new comment
```

### 5. Workspace Member Invitation Flow

```
1. Workspace ADMIN clicks "Add Member"
   ↓
2. InviteMemberDialog opens
   ↓
3. ADMIN enters email and role
   ↓
4. POST /api/workspaces/add-member
   ↓
5. Backend validates:
   - User is workspace ADMIN
   - User exists in database
   - User is not already member
   ↓
6. WorkspaceMember record created
   ↓
7. (Note: Actual invitation sent via Clerk's organization invitation system)
   ↓
8. When user accepts invitation:
   ↓
9. Clerk triggers 'clerk/organizationInvitation.accepted'
   ↓
10. Inngest syncs member to database
```

---

## Data Flow

### Complete Data Flow Example: Creating a Task

```
┌─────────────┐
│   React UI  │
│  Component  │
└──────┬──────┘
       │ 1. User fills form
       │    & clicks submit
       ▼
┌─────────────────────────────────┐
│  CreateTaskDialog Component     │
│  - Validates form data          │
│  - Prepares request payload     │
└──────┬──────────────────────────┘
       │ 2. dispatch(addTask(...))
       │    or direct API call
       ▼
┌─────────────────────────────────┐
│  Redux Thunk / API Call         │
│  - Gets Clerk token             │
│  - Adds Authorization header    │
└──────┬──────────────────────────┘
       │ 3. POST /api/tasks
       │    Headers: Authorization
       ▼
┌─────────────────────────────────┐
│  Express Server                 │
│  - CORS middleware              │
│  - Clerk middleware             │
└──────┬──────────────────────────┘
       │ 4. protect() middleware
       │    Validates token
       ▼
┌─────────────────────────────────┐
│  taskController.createTask()    │
│  - Extracts userId              │
│  - Validates permissions        │
│  - Validates assignee           │
└──────┬──────────────────────────┘
       │ 5. Prisma query
       ▼
┌─────────────────────────────────┐
│  PostgreSQL Database            │
│  - Creates Task record          │
│  - Links to Project & User      │
└──────┬──────────────────────────┘
       │ 6. Task created
       ▼
┌─────────────────────────────────┐
│  taskController (continued)      │
│  - Fetches task with assignee   │
│  - Triggers Inngest event       │
└──────┬──────────────────────────┘
       │ 7. inngest.send()
       ▼
┌─────────────────────────────────┐
│  Inngest                        │
│  - Queues event                 │
│  - Executes function async      │
└──────┬──────────────────────────┘
       │ 8. Response sent
       ▼
┌─────────────────────────────────┐
│  Express Response               │
│  {task: {...}, message: "..."}  │
└──────┬──────────────────────────┘
       │ 9. JSON response
       ▼
┌─────────────────────────────────┐
│  Redux Thunk                    │
│  - Updates Redux state          │
│  - addTask action dispatched    │
└──────┬──────────────────────────┘
       │ 10. State update
       ▼
┌─────────────────────────────────┐
│  React Component                │
│  - Re-renders with new task     │
│  - UI updates                   │
└─────────────────────────────────┘

Parallel Flow (Background):
┌─────────────────────────────────┐
│  Inngest Function               │
│  - Fetches task details         │
│  - Sends email via Nodemailer   │
│  - Schedules reminder           │
└─────────────────────────────────┘
```

### State Management Flow

```
Component Action
    ↓
Redux Action Dispatched
    ↓
Redux Thunk (if async)
    ↓
API Call
    ↓
Response Received
    ↓
Redux Reducer Updates State
    ↓
Components Re-render (if subscribed)
```

---

## Technology Stack

### Frontend
- **React 19**: UI library
- **React Router DOM 7**: Client-side routing
- **Redux Toolkit**: State management
- **Axios**: HTTP client
- **Clerk React**: Authentication
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Recharts**: Data visualization
- **React Hot Toast**: Notifications
- **Date-fns**: Date manipulation
- **Vite**: Build tool

### Backend
- **Node.js**: Runtime
- **Express 5**: Web framework
- **Prisma**: ORM
- **PostgreSQL**: Database (via Neon)
- **Clerk Express**: Authentication middleware
- **Inngest**: Background jobs & event processing
- **Nodemailer**: Email sending
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Infrastructure
- **Clerk**: Authentication & user management
- **Neon**: Serverless PostgreSQL
- **Inngest**: Event-driven background jobs
- **Brevo (Sendinblue)**: SMTP email service
- **Vercel**: Deployment (client & server)

### Development Tools
- **ESLint**: Code linting
- **Nodemon**: Development server auto-reload
- **Prisma Studio**: Database GUI

---

## Environment Variables

### Frontend (`.env`)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASEURL=http://localhost:3000
```

### Backend (`.env`)
```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
SMTP_USER=...
SMTP_PASS=...
SENDER_EMAIL=...
PORT=3000
```

---

## Security Considerations

1. **Authentication**: All API routes protected by Clerk middleware
2. **Authorization**: Role-based access control (ADMIN/MEMBER)
3. **Input Validation**: Backend validates all inputs
4. **SQL Injection**: Prevented by Prisma ORM
5. **CORS**: Configured for specific origins
6. **Token Security**: JWT tokens validated on every request
7. **Cascading Deletes**: Database relationships configured for data integrity

---

## Future Enhancements

Potential improvements and features:
- Real-time updates via WebSockets
- File attachments for tasks
- Task dependencies and subtasks
- Time tracking
- Advanced analytics and reporting
- Mobile application
- Integration with third-party tools (Slack, GitHub, etc.)
- Custom workflows and automation
- Advanced search and filtering

---

## Conclusion

Flowdeck follows a modern, scalable architecture with clear separation of concerns:
- **Frontend**: React-based SPA with Redux for state management
- **Backend**: RESTful API with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk for user management
- **Background Jobs**: Inngest for event-driven workflows
- **Email**: Nodemailer with Brevo SMTP

The application supports multi-workspace, multi-project collaboration with role-based permissions and automated notifications, making it suitable for teams of various sizes.
