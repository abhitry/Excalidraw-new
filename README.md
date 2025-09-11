# Drawing App - Excalidraw Clone

A real-time collaborative drawing application similar to Excalidraw where users can draw shapes like circles, rectangles, and freehand pencil drawings with live synchronization across multiple users.

## 🏗️ Architecture Overview

**Frontend (Next.js 15 + React 19)**
- Canvas-based drawing interface with zoom/pan functionality
- Real-time WebSocket connection for live collaboration
- JWT-based authentication with persistent sessions
- Responsive design supporting both desktop and mobile devices

**Backend Services**
- **HTTP API Server (Express.js)**: Handles authentication, room management, and data persistence
- **WebSocket Server**: Manages real-time events (drawing updates, user presence, shape operations)
- **PostgreSQL Database**: Stores user data, room information, and drawing history via Prisma ORM

**Key Workflows**
1. **User Authentication**: JWT-based signup/signin with password validation
2. **Room Management**: Create/join rooms with optional password protection
3. **Real-time Drawing**: Canvas events → WebSocket → Database → Broadcast to all room users
4. **Data Persistence**: All drawing operations stored in PostgreSQL before real-time sync
5. **Collaborative Features**: Multi-user drawing, shape deletion, canvas clearing, and live cursors

**Deployment Architecture**
- **Containerization**: Docker containers for all services with multi-stage builds
- **Kubernetes Orchestration**: Deployed on GKE with HPA, persistent volumes, and service mesh
- **HTTPS & Load Balancing**: nginx-ingress with Let's Encrypt SSL certificates
- **Database**: PostgreSQL with persistent storage and automated migrations

## Features

- **Real-time Collaboration**: Multiple users can draw on the same canvas simultaneously
- **Drawing Tools**: 
  - Pencil tool for freehand drawing
  - Rectangle tool for drawing rectangles
  - Circle tool for drawing circles
- **Zoom and Pan**: Mouse wheel to zoom in/out, pan around the canvas
- **Persistent Storage**: All drawings are saved to the database
- **User Authentication**: Simple email/password authentication

## Project Structure

```
├── apps/
│   ├── excelidraw-frontend/    # Next.js frontend application
│   ├── http-backend/           # Express.js HTTP API server
│   └── ws-backend/             # WebSocket server for real-time communication
├── packages/
│   ├── db/                     # Prisma database schema and client
│   ├── common/                 # Shared types and schemas
│   ├── backend-common/         # Backend configuration
│   └── ui/                     # Shared UI components
```

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm package manager

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your database URL and other configurations:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/drawing_app"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXT_PUBLIC_HTTP_BACKEND="http://localhost:3001"
   NEXT_PUBLIC_WS_URL="ws://localhost:8080"
   ```

4. Generate Prisma client and push schema:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

### 3. Running the Application

You need to run three services:

#### Terminal 1 - HTTP Backend (Port 3001)
```bash
cd apps/http-backend
pnpm dev
```

#### Terminal 2 - WebSocket Backend (Port 8080)
```bash
cd apps/ws-backend
pnpm dev
```

#### Terminal 3 - Frontend (Port 3000)
```bash
cd apps/excelidraw-frontend
pnpm dev
```

### 4. Using the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign up" to create a new account
3. Fill in your name, email, and password
4. Click "Sign in" with your credentials
5. Create a room by entering a room name
6. Start drawing! You can:
   - Select different tools (Pencil, Rectangle, Circle)
   - Use mouse wheel to zoom in/out
   - Click the reset button to reset zoom/pan
   - Share the room URL with others for collaboration

## Available Scripts

### Root Level
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all applications
- `pnpm setup` - Install dependencies and setup database

### Database Commands
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/drawing_app"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Frontend URLs
NEXT_PUBLIC_HTTP_BACKEND="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

## Troubleshooting

1. **Database Connection Issues**: Make sure PostgreSQL is running and the DATABASE_URL is correct
2. **WebSocket Connection Failed**: Ensure the WebSocket server is running on port 8080
3. **CORS Issues**: The HTTP backend is configured to allow all origins in development
4. **Port Conflicts**: Make sure ports 3000, 3001, and 8080 are available

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, WebSocket (ws), JWT authentication
- **Database**: PostgreSQL with Prisma ORM
- **Build System**: Turborepo monorepo setup
- **Package Manager**: pnpm
