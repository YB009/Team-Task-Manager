# Team Task Manager

Modern React + Vite frontend with an Express/Prisma/PostgreSQL backend and Firebase authentication (email/password and social logins). The project is set up as a workspace with `client` and `server` packages.

## Tech stack
- Frontend: React 19, Vite, Tailwind CSS, Axios
- Auth: Firebase Auth (email/password + Google, Facebook, GitHub, Twitter/X)
- Backend: Node/Express, Prisma ORM, PostgreSQL, Firebase Admin for token verification
- Dev tooling: Nodemon, ESLint (via Vite default), npm workspaces

## Project structure
```
team-task-manager/
  client/              # React app
  server/              # Express API + Prisma
  infra/, docs/        # CI/CD, docs, scripts
```

## Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally (or a connection string)
- Firebase project with Web app credentials and enabled providers you plan to use

## Environment variables
Create `.env` files in both `client/` and `server/` using these keys (replace placeholders with your values):

`client/.env` (Vite uses the `VITE_` prefix):
```
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=... (optional)
```

`server/.env` (example keys):
```
PORT=3001
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=TTM
PG_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/TTM

CLIENT_URL=http://localhost:5173

# Firebase Admin service account is read from firebase-service-account.json
```

## Install & run
In one shell (backend):
```
cd server
npm install
npx prisma generate
npm run dev   # starts nodemon on the API
```

In another shell (frontend):
```
cd client
npm install
npm run dev   # starts Vite on 5173
```

## Firebase setup checklist
- Add an iOS/Android/Web app in Firebase to get the Web API key and app ID.
- Enable providers you need (Email/Password, Google, Facebook, GitHub, Twitter/X).
- For each social provider, set the callback/redirect URLs in the provider console to the Firebase handler:
  - `https://your_project.firebaseapp.com/__/auth/handler`
  - `https://your_project.web.app/__/auth/handler`
- Put the provider keys/secrets in Firebase Auth > Sign-in method (server does not need them directly). 
- Add `localhost` (and any deployed domains) to Firebase Auth authorized domains.

## API protection
- The backend uses middleware to verify Firebase ID tokens and load the user from Prisma. Apply it to any protected routes (projects, tasks, billing, etc.).
- Client-side route guards (`PrivateRoute`) improve UX but do not secure the API—keep the middleware enabled on the server.

## Common scripts
- Backend: `npm run dev` (nodemon), `npm run start` (node)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Troubleshooting
- `ERR_MODULE_NOT_FOUND prisma/client.js`: ensure imports point to `server/prisma/client.js` and run `npx prisma generate` after installing deps.
- Auth errors (invalid credential/redirect): double-check Firebase Web API key in `client/.env`, callback URLs in provider consoles, and authorized domains in Firebase Auth.

## License
MIT (update if your project uses a different license).
