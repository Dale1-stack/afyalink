# AfyaLink

AfyaLink is a Kenya-focused healthcare discovery application. It helps people find facilities, explore the services they offer, see them on a map, and search for nearby options using their location.

Registered users can also manage their own facility and service records. Authentication and ownership are enforced by the API: a user can create, update, delete, and assign services only for records they own.

## Features

- Browse healthcare facilities and healthcare service categories.
- Search and filter facilities by name, location, type, and services.
- View facility details, opening hours, contact information, accessibility, and directions.
- Explore facilities on an interactive Leaflet/OpenStreetMap map.
- Find nearby facilities through the browser location API and Overpass/OpenStreetMap.
- Register, log in, check the current session, and log out.
- Create and manage personal facility and service records from the protected **Manage** area.
- Enforce server-side ownership checks for every protected write operation.

## Architecture

```text
React + Vite frontend
        |
        | HTTPS / JSON API
        v
Flask API ─── PostgreSQL
        |
        +── OpenStreetMap / Overpass nearby-facility data
```

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Leaflet, React Leaflet |
| Backend | Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS |
| Database | PostgreSQL and Alembic migrations |
| Authentication | Werkzeug password hashing and signed, expiring bearer tokens |
| Deployment | Render configuration in `render.yaml` |

## Repository layout

```text
afyalink/
├── backend/
│   ├── app/
│   │   ├── models/          # User, Facility, Service, and associations
│   │   ├── routes/          # Auth, facility, and service endpoints
│   │   ├── auth.py          # Token and ownership guards
│   │   ├── config.py        # Environment configuration
│   │   └── extensions.py    # Flask extensions
│   ├── migrations/          # Alembic database migrations
│   ├── seed.py              # Initial catalogue data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/         # Authentication and location state
│   │   ├── pages/
│   │   └── services/        # API and map integrations
│   └── package.json
└── render.yaml
```

## Prerequisites

- Python 3.10 or later
- Node.js 20 or later (Node 24 is supported)
- npm 10 or later
- PostgreSQL 14 or later

When using WSL, install and run Node/npm inside WSL. Do not share a `node_modules` directory installed by Windows PowerShell with WSL; native packages such as Rolldown are platform-specific.

## Local setup

### 1. Clone and configure the backend

```bash
git clone <your-repository-url>
cd afyalink/backend
python -m venv venv
```

Activate the virtual environment:

```bash
# macOS, Linux, or WSL
source venv/bin/activate

# Windows PowerShell
.\venv\Scripts\Activate.ps1
```

Install dependencies and create the backend environment file:

```bash
pip install -r requirements.txt
cp .env.example .env
```

On Windows PowerShell, use this instead of `cp`:

```powershell
Copy-Item .env.example .env
```

Update `backend/.env` with your local PostgreSQL connection and a long random secret:

```dotenv
DATABASE_URL=postgresql+psycopg2://afyalink_user:your-password@localhost:5432/afyalink
SECRET_KEY=use-a-random-secret-of-at-least-32-characters
ACCESS_TOKEN_EXPIRES_SECONDS=3600
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Create the database before continuing. For example:

```sql
CREATE DATABASE afyalink;
```

### 2. Run migrations and seed data

From `backend/`:

```bash
flask --app run:app db upgrade
python seed.py --add-missing
```

The seed command creates the public AfyaLink catalogue and is safe to run again. Seeded catalogue data has no user owner, so it is visible to everyone but cannot be changed through user-management endpoints.

### 3. Start the backend

```bash
flask --app run:app run --debug
```

The API is available at `http://127.0.0.1:5000/api`.

Check it with:

```bash
curl http://127.0.0.1:5000/api/health
```

### 4. Configure and start the frontend

Open a second terminal:

```bash
cd afyalink/frontend
cp .env.example .env
```

For local development, set `frontend/.env` to:

```dotenv
VITE_API_URL=http://127.0.0.1:5000/api
```

Install and run the frontend:

```bash
npm ci --include=dev
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

To verify a production build:

```bash
npm run build
```

## Authentication and ownership

### Authentication flow

1. A user registers with an email address and a password of at least 12 characters.
2. The backend stores only a password hash, never the password itself.
3. Registration and login return a signed bearer access token.
4. The frontend keeps the session in `sessionStorage`, so closing the browser tab ends the local session.
5. The frontend sends the token as `Authorization: Bearer <token>` for protected API requests.
6. Tokens expire after `ACCESS_TOKEN_EXPIRES_SECONDS` (one hour by default). Logging out invalidates the current user's tokens.

### Ownership rules

- Public visitors may read facilities and services.
- Authentication is required to create facilities or services.
- A facility or service is assigned to the authenticated user at creation time.
- Only its owner can update or delete it.
- Assigning or removing a service from a facility requires ownership of both the facility and service.
- A request attempting to change another user's data receives `403 Forbidden`.
- `GET /api/facilities/mine` and `GET /api/services/mine` return only the authenticated user's records.

Ownership is checked on the backend, not merely hidden in the frontend, so direct API requests cannot bypass it.

## API reference

The base URL is `/api`. JSON requests should include `Content-Type: application/json`.

### Health

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/health` | API and database health status | No |

### Authentication

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Create an account and return a session | No |
| `POST` | `/auth/login` | Log in and return a session | No |
| `GET` | `/auth/me` | Return the current user | Bearer token |
| `POST` | `/auth/logout` | Invalidate the user's active tokens | Bearer token |

Register request:

```json
{
  "email": "name@example.com",
  "password": "a-secure-password-with-12-or-more-characters"
}
```

Successful register/login response:

```json
{
  "access_token": "signed-token-value",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "email": "name@example.com"
  }
}
```

### Facilities

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/facilities/` | List public facilities | No |
| `GET` | `/facilities/mine` | List the user's facilities | Bearer token |
| `GET` | `/facilities/:id` | Get a facility | No |
| `GET` | `/facilities/nearby?latitude=:lat&longitude=:lng&radius=:metres` | Query nearby OSM facilities | No |
| `POST` | `/facilities/` | Create a facility | Bearer token |
| `PUT` | `/facilities/:id` | Update an owned facility | Bearer token + owner |
| `DELETE` | `/facilities/:id` | Delete an owned facility | Bearer token + owner |
| `POST` | `/facilities/:id/services` | Assign an owned service | Bearer token + owner |
| `DELETE` | `/facilities/:id/services/:serviceId` | Remove an owned service | Bearer token + owner |

Required fields for creating a facility are `name`, `type`, `address`, `county`, `latitude`, and `longitude`.

Example:

```json
{
  "name": "Example Community Clinic",
  "type": "Clinic",
  "address": "123 Example Road",
  "county": "Nairobi",
  "latitude": -1.286389,
  "longitude": 36.817223,
  "phone": "+254 700 000000",
  "emergency": false,
  "opening_hours": {
    "monday": "08:00-17:00"
  }
}
```

### Services

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/services/` | List public services | No |
| `GET` | `/services/mine` | List the user's services | Bearer token |
| `GET` | `/services/:id` | Get a service | No |
| `POST` | `/services/` | Create a service | Bearer token |
| `PUT` | `/services/:id` | Update an owned service | Bearer token + owner |
| `DELETE` | `/services/:id` | Delete an owned service | Bearer token + owner |

## Example authenticated request

```bash
curl -X POST http://127.0.0.1:5000/api/facilities/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access-token>" \
  -d '{
    "name": "Example Clinic",
    "type": "Clinic",
    "address": "Example Road",
    "county": "Nairobi",
    "latitude": -1.286389,
    "longitude": 36.817223
  }'
```

## Database migrations

Use Flask-Migrate/Alembic for schema changes. Never edit production tables manually to skip a migration.

```bash
cd backend
flask --app run:app db current
flask --app run:app db upgrade
```

The migration `b9c2d7e4f1a0_add_users_and_resource_owners` creates the `users` table and adds owner references to facilities and services.

## Deployment

`render.yaml` provisions:

- A Python web service rooted at `backend/`.
- A Render PostgreSQL database.
- A generated `SECRET_KEY` and database connection.
- A health check at `/api/health`.
- Database migrations and seed updates before Gunicorn starts.

Before deploying a frontend, set these backend environment variables in Render:

```dotenv
SECRET_KEY=a-random-secret-with-at-least-32-characters
CORS_ORIGINS=https://your-frontend-domain.example
ACCESS_TOKEN_EXPIRES_SECONDS=3600
```

Use a comma-separated value for more than one approved frontend origin. Do not use `*` for an authenticated production API.

After committing and pushing backend changes, redeploy the Render service so new routes and migrations are available:

```bash
git add backend frontend README.md
git commit -m "Describe AfyaLink setup and API"
git push
```

## Troubleshooting

### Registration shows “Failed to fetch”

1. Confirm `VITE_API_URL` points to the intended backend.
2. Open `<VITE_API_URL>/health` in a browser.
3. Ensure the backend is deployed with the authentication routes; `/api/auth/register` must not return `404`.
4. Add the exact frontend origin (including port) to `CORS_ORIGINS`, then redeploy the backend.
5. Restart Vite after editing any `VITE_*` environment value.

### Rolldown native-binding error under WSL

This happens when `node_modules` was installed on Windows but Vite is started in WSL. From the WSL terminal, run:

```bash
cd /mnt/c/Users/ADMIN/afyalink/frontend
rm -rf node_modules
npm ci --include=dev --no-audit --no-fund
npm run build
```

### API returns `401`

Log in again. The token may be missing, expired, or invalidated by logout.

### API returns `403`

The account is authenticated but does not own the requested facility or service. Sign in as the owner or create a new record.

## Environment variable reference

| Variable | Used by | Required | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Backend | Yes | SQLAlchemy PostgreSQL connection string |
| `SECRET_KEY` | Backend | Yes in staging/production | Signs access tokens |
| `ACCESS_TOKEN_EXPIRES_SECONDS` | Backend | No | Token lifetime; defaults to `3600` |
| `CORS_ORIGINS` | Backend | Yes for hosted frontend | Comma-separated allowed browser origins |
| `VITE_API_URL` | Frontend | Yes | Full API base URL, including `/api` |

## Contributing

1. Create a feature branch.
2. Keep migrations with model/schema changes.
3. Run backend migration checks and `npm run build` before opening a pull request.
4. Do not commit `.env` files, database credentials, access tokens, or generated `node_modules` content.
