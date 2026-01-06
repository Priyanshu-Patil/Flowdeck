# 🚀 Flowdeck

**A Modern, Full-Stack Project Management Platform**

Flowdeck is a comprehensive project management and collaboration tool designed to help teams organize their work, track progress, and achieve their goals efficiently. Built with modern web technologies, Flowdeck provides an intuitive interface for managing workspaces, projects, tasks, and team collaboration.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Why Flowdeck?](#why-flowdeck)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Flowdeck is a full-stack project management application that enables teams to:
- Create and manage multiple workspaces
- Organize projects with detailed tracking
- Assign and track tasks with various types and priorities
- Collaborate through comments and team management
- Visualize progress with analytics and calendar views
- Receive automated email notifications

The application follows a modern architecture pattern with a React-based frontend and a Node.js/Express backend, ensuring scalability, maintainability, and an excellent user experience.

---

## 💡 Why Flowdeck?

### The Problem
Modern teams struggle with:
- **Fragmented Tools**: Using multiple disconnected tools for project management, communication, and tracking
- **Poor Visibility**: Lack of real-time insights into project progress and team workload
- **Inefficient Collaboration**: Difficulty in coordinating tasks, deadlines, and team members
- **Manual Processes**: Time-consuming manual updates and notifications

### The Solution
Flowdeck addresses these challenges by providing:
- **Unified Platform**: All project management needs in one place
- **Real-time Analytics**: Dashboard with comprehensive statistics and visualizations
- **Automated Workflows**: Background jobs for email notifications and task reminders
- **Seamless Collaboration**: Built-in commenting, team management, and workspace organization
- **Modern UX**: Beautiful, responsive interface built with TailwindCSS

### Who Can Benefit?
- **Development Teams**: Track features, bugs, and improvements
- **Project Managers**: Monitor progress, deadlines, and team performance
- **Small to Medium Businesses**: Organize multiple projects across different workspaces
- **Remote Teams**: Collaborate effectively with real-time updates and notifications

---

## ✨ Features

### 🏢 Workspace Management
- Create and manage multiple workspaces
- Invite team members with role-based access (Admin/Member)
- Customize workspace settings and branding
- Switch between workspaces seamlessly

### 📊 Project Management
- Create projects with detailed descriptions and metadata
- Set project status (Active, Planning, Completed, On Hold, Cancelled)
- Define project priorities (Low, Medium, High)
- Track project progress with visual indicators
- Set start and end dates for timeline management
- Assign team leads and project members

### ✅ Task Management
- Create tasks with multiple types:
  - **Task**: General work items
  - **Bug**: Issues to be fixed
  - **Feature**: New functionality
  - **Improvement**: Enhancements to existing features
  - **Other**: Miscellaneous items
- Task status tracking (Todo, In Progress, Done)
- Priority levels (Low, Medium, High)
- Assign tasks to team members
- Set due dates for deadline management
- Add detailed descriptions and comments

### 💬 Collaboration
- Comment on tasks for team discussions
- Real-time activity feed
- Team member management
- Project member assignments

### 📈 Analytics & Reporting
- Dashboard with key statistics:
  - Total projects
  - Active tasks
  - Completed tasks
  - Team members
- Project overview with progress tracking
- Task summary widgets
- Calendar view for deadline visualization
- Project analytics with charts and graphs

### 🔔 Notifications
- Automated email notifications for:
  - Task assignments
  - Task due date reminders
- Background job processing with Inngest
- Real-time updates in the application

### 🎨 User Experience
- Modern, responsive design
- Dark mode support
- Intuitive navigation
- Fast page loads with Vite
- Toast notifications for user feedback
- Beautiful icons with Lucide React

---

## 🛠 Tech Stack

### Frontend Technologies

#### **React 19.1.1**
- **What it is**: A JavaScript library for building user interfaces
- **Why it's used**: React provides a component-based architecture, making it easy to build reusable UI components and manage complex state. Version 19 includes performance improvements and better developer experience.
- **Role in Flowdeck**: Powers the entire frontend interface, enabling dynamic, interactive user experiences.

#### **Vite 7.1.2**
- **What it is**: A next-generation frontend build tool and development server
- **Why it's used**: Vite offers lightning-fast hot module replacement (HMR) during development and optimized production builds. It's significantly faster than traditional bundlers like Webpack.
- **Role in Flowdeck**: Provides the build system, development server, and production bundling for the React application.

#### **TailwindCSS 4.1.12**
- **What it is**: A utility-first CSS framework
- **Why it's used**: TailwindCSS allows rapid UI development with utility classes, eliminating the need for custom CSS files. It's highly customizable and results in smaller production CSS bundles.
- **Role in Flowdeck**: Styles the entire application with a modern, responsive design system. Used for layouts, colors, spacing, and responsive breakpoints.

#### **Redux Toolkit 2.8.2**
- **What it is**: The official, opinionated, batteries-included toolset for efficient Redux development
- **Why it's used**: Redux Toolkit simplifies Redux usage with less boilerplate, better TypeScript support, and built-in best practices. It manages global application state efficiently.
- **Role in Flowdeck**: Manages global state for workspaces, theme preferences, and user data across the application.

#### **React Router DOM 7.8.1**
- **What it is**: A routing library for React applications
- **Why it's used**: Enables client-side routing, allowing navigation between different pages without full page reloads. Provides a seamless single-page application (SPA) experience.
- **Role in Flowdeck**: Handles routing for Dashboard, Projects, Team, Project Details, and Task Details pages.

#### **Clerk (React) 5.59.0**
- **What it is**: A complete authentication and user management solution
- **Why it's used**: Clerk provides pre-built authentication components, user management, organization/workspace management, and secure session handling. It eliminates the need to build authentication from scratch.
- **Role in Flowdeck**: Handles user authentication, workspace/organization management, and user profile management. Integrates seamlessly with the backend for secure API access.

#### **Axios 1.13.2**
- **What it is**: A promise-based HTTP client for making API requests
- **Why it's used**: Axios provides a clean API for HTTP requests with interceptors, automatic JSON transformation, and better error handling than the native fetch API.
- **Role in Flowdeck**: Makes API calls to the backend server for all data operations (CRUD for workspaces, projects, tasks, comments).

#### **Recharts 3.1.2**
- **What it is**: A composable charting library built on React components
- **Why it's used**: Recharts provides beautiful, responsive charts with minimal configuration. It's built specifically for React, making integration seamless.
- **Role in Flowdeck**: Powers the analytics and reporting features, displaying project progress, task distribution, and other visual data representations.

#### **Lucide React 0.540.0**
- **What it is**: A beautiful, consistent icon library
- **Why it's used**: Provides a comprehensive set of customizable icons that are lightweight and tree-shakeable. Icons are consistent in style and easy to use.
- **Role in Flowdeck**: Used throughout the UI for icons (navigation, buttons, status indicators, etc.).

#### **React Hot Toast 2.6.0**
- **What it is**: A toast notification library for React
- **Why it's used**: Provides beautiful, customizable toast notifications with smooth animations. Better UX than browser alerts.
- **Role in Flowdeck**: Displays success, error, and info messages for user actions (creating projects, updating tasks, etc.).

#### **date-fns 4.1.0**
- **What it is**: A modern JavaScript date utility library
- **Why it's used**: Provides simple, consistent functions for formatting, parsing, and manipulating dates. Lightweight and modular.
- **Role in Flowdeck**: Formats dates for display (due dates, creation dates, calendar views) and handles date calculations.

### Backend Technologies

#### **Express.js 5.2.1**
- **What it is**: A fast, unopinionated web framework for Node.js
- **Why it's used**: Express provides a minimal, flexible framework for building RESTful APIs. It's the most popular Node.js framework with extensive middleware support.
- **Role in Flowdeck**: Powers the backend API server, handling HTTP requests, routing, and middleware integration.

#### **Prisma 6.19.1**
- **What it is**: A next-generation ORM (Object-Relational Mapping) for Node.js and TypeScript
- **Why it's used**: Prisma provides type-safe database access, automatic migrations, and an intuitive query API. It eliminates SQL boilerplate and provides excellent developer experience.
- **Role in Flowdeck**: Manages all database operations, provides type-safe queries, and handles the database schema through migrations.

#### **PostgreSQL (via Neon)**
- **What it is**: A powerful, open-source relational database system
- **Why it's used**: PostgreSQL is reliable, feature-rich, and supports complex queries. Neon provides serverless PostgreSQL, making it perfect for scalable applications with automatic scaling and pay-as-you-go pricing.
- **Role in Flowdeck**: Stores all application data (users, workspaces, projects, tasks, comments) with relational integrity and ACID compliance.

#### **Clerk (Express) 1.7.60**
- **What it is**: Backend SDK for Clerk authentication
- **Why it's used**: Provides middleware to verify authentication tokens and extract user information from requests. Ensures secure API endpoints.
- **Role in Flowdeck**: Protects API routes, verifies user authentication, and provides user context to route handlers.

#### **Inngest 3.48.1**
- **What it is**: A platform for building reliable background jobs and event-driven workflows
- **Why it's used**: Inngest handles background job processing, scheduled tasks, and event-driven workflows. It provides retries, observability, and scales automatically.
- **Role in Flowdeck**: Powers background jobs for:
  - Syncing user data from Clerk to the database
  - Syncing workspace/organization data
  - Sending email notifications for task assignments
  - Sending task reminder emails on due dates

#### **Nodemailer 7.0.12**
- **What it is**: A module for Node.js to send emails easily
- **Why it's used**: Provides a simple API for sending emails through SMTP servers. Supports HTML emails and attachments.
- **Role in Flowdeck**: Sends email notifications to users when tasks are assigned or when reminders are due. Uses Brevo (formerly Sendinblue) SMTP service.

#### **CORS 2.8.5**
- **What it is**: A Node.js package for providing Express middleware to enable CORS (Cross-Origin Resource Sharing)
- **Why it's used**: Allows the frontend (running on a different port/domain) to make requests to the backend API. Essential for development and production deployments.
- **Role in Flowdeck**: Enables the React frontend to communicate with the Express backend API.

#### **dotenv 17.2.3**
- **What it is**: A module that loads environment variables from a `.env` file
- **Why it's used**: Securely manages configuration and secrets without hardcoding them in the application code.
- **Role in Flowdeck**: Loads database URLs, API keys, SMTP credentials, and other environment-specific configuration.

#### **WebSocket (ws) 8.18.3**
- **What it is**: A WebSocket library for Node.js
- **Why it's used**: Enables real-time, bidirectional communication between client and server. Useful for live updates and notifications.
- **Role in Flowdeck**: Provides infrastructure for real-time features (though currently used for future real-time collaboration features).

### Development Tools

#### **ESLint 9.33.0**
- **What it is**: A pluggable JavaScript linter
- **Why it's used**: Identifies and fixes code quality issues, enforces coding standards, and helps maintain consistent code style.
- **Role in Flowdeck**: Ensures code quality and consistency across the frontend codebase.

#### **Nodemon 3.1.11**
- **What it is**: A utility that monitors for file changes and automatically restarts the Node.js server
- **Why it's used**: Speeds up development by eliminating the need to manually restart the server after code changes.
- **Role in Flowdeck**: Used in development mode for the backend server.

---

## 🏗 Architecture

Flowdeck follows a **monorepo structure** with separate client and server directories:

```
Flowdeck/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── features/      # Redux slices
│   │   ├── configs/       # Configuration files
│   │   └── assets/        # Static assets
│   └── public/      # Public assets
│
└── server/          # Express backend API
    ├── controllers/ # Business logic
    ├── routes/      # API route definitions
    ├── middlewares/ # Express middlewares
    ├── configs/     # Configuration (Prisma, Nodemailer)
    ├── inngest/     # Background job functions
    └── prisma/      # Database schema and migrations
```

### Data Flow

1. **User Authentication**: Clerk handles authentication, and Inngest syncs user data to PostgreSQL
2. **API Requests**: Frontend makes authenticated requests to Express API
3. **Database Operations**: Prisma ORM handles all database queries
4. **Background Jobs**: Inngest processes events (user creation, task assignment) and triggers email notifications
5. **State Management**: Redux manages global state, while local component state handles UI-specific data

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (or Neon account for serverless PostgreSQL)
- **Clerk account** (for authentication)
- **Brevo account** (for email sending, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flowdeck
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   PORT=3000
   SMTP_USER="your_brevo_smtp_user"
   SMTP_PASS="your_brevo_smtp_password"
   SENDER_EMAIL="your_sender_email@example.com"
   INNGEST_EVENT_KEY="your_inngest_event_key"
   INNGEST_SIGNING_KEY="your_inngest_signing_key"
   ```

   Create a `.env` file in the `client/` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   VITE_BASEURL="http://localhost:3000"
   ```

5. **Set up the database**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Run the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run server
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173` (or the port shown in terminal)
   - Backend API: `http://localhost:3000`

### Production Build

**Build the frontend:**
```bash
cd client
npm run build
```

**Start the production server:**
```bash
cd server
npm start
```

---

## 📁 Project Structure

### Client Structure
```
client/
├── src/
│   ├── app/
│   │   └── store.js              # Redux store configuration
│   ├── components/                # Reusable components
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── Sidebar.jsx           # Side navigation
│   │   ├── CreateProjectDialog.jsx
│   │   ├── CreateTaskDialog.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectAnalytics.jsx
│   │   ├── ProjectCalendar.jsx
│   │   └── ...
│   ├── pages/                    # Route pages
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Projects.jsx          # Projects listing
│   │   ├── ProjectDetails.jsx    # Project detail view
│   │   ├── TaskDetails.jsx       # Task detail view
│   │   └── Team.jsx              # Team management
│   ├── features/                 # Redux slices
│   │   ├── themeSlice.js         # Theme state management
│   │   └── workspaceSlice.js    # Workspace state management
│   ├── configs/
│   │   └── api.js                # Axios configuration
│   └── App.jsx                   # Main app component
├── public/                       # Static assets
└── package.json
```

### Server Structure
```
server/
├── controllers/                  # Business logic
│   ├── projectController.js
│   ├── taskController.js
│   ├── workspaceControllers.js
│   └── commentController.js
├── routes/                       # API routes
│   ├── projectsRoutes.js
│   ├── taskRoutes.js
│   ├── workspaceRoutes.js
│   └── commentRoutes.js
├── middlewares/
│   └── authMiddlewares.js        # Authentication middleware
├── configs/
│   ├── prisma.js                 # Prisma client instance
│   └── nodemailer.js             # Email configuration
├── inngest/
│   └── index.js                  # Background job functions
├── prisma/
│   └── schema.prisma             # Database schema
└── server.js                     # Express app entry point
```

---

## 🔐 Environment Variables

### Server (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `CLERK_SECRET_KEY` | Clerk backend secret key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `SMTP_USER` | Brevo SMTP username | Yes (for emails) |
| `SMTP_PASS` | Brevo SMTP password | Yes (for emails) |
| `SENDER_EMAIL` | Email address for sending emails | Yes (for emails) |
| `INNGEST_EVENT_KEY` | Inngest event key | Yes (for background jobs) |
| `INNGEST_SIGNING_KEY` | Inngest signing key | Yes (for background jobs) |

### Client (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key | Yes |
| `VITE_BASEURL` | Backend API base URL | Yes |

---

## 📡 API Documentation

### Workspace Endpoints
- `GET /api/workspaces` - Get all workspaces for the user
- `POST /api/workspaces` - Create a new workspace
- `PUT /api/workspaces` - Update a workspace
- `POST /api/workspaces/:id/invite` - Invite a member to workspace

### Project Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects` - Update a project
- `POST /api/projects/:projectId/addMember` - Add member to project

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Comment Endpoints
- `GET /api/comments/:taskId` - Get comments for a task
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

**Note**: All endpoints require authentication via Clerk middleware.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Write clean, maintainable code

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](client/LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **Clerk** for authentication and user management
- **Prisma** for the excellent ORM experience
- **Inngest** for reliable background job processing
- **TailwindCSS** for the beautiful design system
- **React** and the entire open-source community

---

## 📞 Support

For questions, issues, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using modern web technologies**
