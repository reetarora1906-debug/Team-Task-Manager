# Syncro — Team Task Manager

A full-stack web application for managing projects, assigning tasks, and tracking progress with **role-based access control (Admin/Member)**.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TailwindCSS v4, Vite |
| Backend | Express.js, Node.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT, Google OAuth 2.0 (Passport.js) |

## 🎯 Key Features

- **Authentication** — Email/password signup & login, Google OAuth, JWT-based sessions
- **Role-Based Access** — Admin (full CRUD) and Member (view/update assigned)
- **Project Management** — Create, edit, delete projects with team members
- **Task Tracking** — Kanban-style board with To Do, In Progress, In Review, Completed
- **Dashboard** — Stats overview, active projects, recent activity feed
- **Team Management** — View members, manage roles (Admin)
- **Activity Feed** — Timeline of project/task updates
- **Responsive Design** — Works on desktop, tablet, and mobile

## 📦 Setup

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Google OAuth credentials (optional)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Google OAuth credentials
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## 🔐 Environment Variables

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/  # Layout, UI components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # All page views
│   │   └── services/    # API layer (axios)
│
├── backend/           # Express.js REST API
│   ├── config/        # DB & Passport config
│   ├── controllers/   # Route handlers
│   ├── middleware/     # Auth & role guards
│   ├── models/        # Mongoose schemas
│   └── routes/        # API routes
```

## 🎨 Design System

Built following the **Kinetic Enterprise** design system:
- Primary: Indigo-600 (`#4f46e5`)
- Typography: Inter
- Rounded: 8px default
- Shadows: 3-level tonal system
