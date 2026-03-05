# NexusChat — AI Chat SaaS Platform

A production-grade, scalable AI chat application with real-time streaming, JWT authentication, and a premium dark UI.

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript         |
| Database | PostgreSQL, Prisma ORM               |
| AI       | OpenRouter API (GPT-4o-mini)         |
| Auth     | JWT + bcrypt                         |
| Deploy   | Docker + Docker Compose              |

## Project Structure

```
ai-chatbot/
├── frontend/          # Next.js 14 App Router
│   ├── src/
│   │   ├── app/       # Pages and layouts
│   │   ├── components/# Reusable UI components
│   │   ├── context/   # Auth and Chat state management
│   │   └── lib/       # Types and API client
│   ├── Dockerfile
│   └── package.json
├── backend/           # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/        # Database schema
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- OpenRouter API key ([get one here](https://openrouter.ai/keys))

### 1. Clone and Install

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENROUTER_API_KEY
npm install

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 2. Set Up Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000)

## Docker Deployment

```bash
# Set your API key
export OPENROUTER_API_KEY=your-key-here
export JWT_SECRET=your-random-secret-here

# Build and run all services
docker-compose up --build -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy
```

The app will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint             | Auth | Description            |
| ------ | -------------------- | ---- | ---------------------- |
| POST   | `/api/auth/register` | No   | Create account         |
| POST   | `/api/auth/login`    | No   | Sign in                |
| GET    | `/api/chats`         | Yes  | List user's chats      |
| POST   | `/api/chats`         | Yes  | Create new chat        |
| GET    | `/api/chats/:id`     | Yes  | Get chat with messages |
| PUT    | `/api/chats/:id`     | Yes  | Rename chat            |
| DELETE | `/api/chats/:id`     | Yes  | Delete chat            |
| POST   | `/api/chat`          | Yes  | Stream AI response     |

## Environment Variables

### Backend (`.env`)

| Variable             | Description                  | Required |
| -------------------- | ---------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string | Yes      |
| `JWT_SECRET`         | Secret for JWT signing       | Yes      |
| `JWT_EXPIRES_IN`     | Token expiry (e.g., `7d`)    | No       |
| `OPENROUTER_API_KEY` | OpenRouter API key           | Yes      |
| `PORT`               | Server port (default: 5000)  | No       |
| `CORS_ORIGIN`        | Allowed frontend origin      | No       |

### Frontend (`.env.local`)

| Variable              | Description                                    | Required |
| --------------------- | ---------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend URL (default: `http://localhost:5000`) | No       |

## License

MIT
