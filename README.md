# RAG-Azure Frontend

This repository contains an Angular frontend app and an ASP.NET Core backend for the RAG-Azure project.

## Run with Docker Compose

The easiest way to run both services locally is with Docker Compose.

```powershell
docker compose up --build
```

After startup:

- Frontend: http://localhost:4200
- Backend: http://localhost:8080

## Services

- `frontend` builds the Angular app from `RAG/`
- `backend` builds the ASP.NET Core API from `RAG/RAG-Azure/Dockerfile`

## Stop services

```powershell
docker compose down
```

## Notes

- Make sure Docker Desktop is installed and running.
- If your system uses the legacy Compose command, use `docker-compose up --build` instead.
- The frontend service is configured to listen on `0.0.0.0:4200` so it is accessible from your host machine.
- The backend service is configured to listen on `0.0.0.0:8080` and maps port `8080` to the host.
