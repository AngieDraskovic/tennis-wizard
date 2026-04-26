# Vamos Project

Fullstack web application for tennis data analysis, built with FastAPI (backend) and React + Vite (frontend), fully containerized using Docker.

---

## 🚀 Tech Stack

* FastAPI – backend API
* React – frontend UI
* Vite – dev server & bundler
* Docker – containerized development
* SQLite – lightweight database
* SQLAlchemy – database interaction

---

## 📦 Features

* Import (ingest) tennis match data from CSV files
* Store and query data using SQLite
* REST API for player statistics
* Frontend visualization of player data
* Fully Dockerized development environment
* Hot reload enabled for both frontend and backend

---

## 🏗️ Project Structure

```
vamos/
  ├── vamos-app/    # React + Vite frontend
  ├── vamos-back/   # FastAPI backend
  ├── docker-compose.yaml
  └── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AngieDraskovic/tennis-wizard.git
cd vamos
```

---

### 2. Import Data (required)

Before starting the application, you must populate the database:

```bash
docker compose run --rm backend python -m app.ingest
```

This step:

* reads tennis match data from CSV files
* creates and populates the SQLite database (`tennis.db`)

---

### 3. Run the Application

```bash
docker compose run --rm backend python -m app.ingest
docker compose up --build
```

---

### 4. Access the App

* Frontend → http://localhost:5173
* Backend API docs → http://localhost:8000

---

## 🧠 Data Persistence

The application uses SQLite as a local database.

The database file (`tennis.db`) is stored on your machine via a Docker volume mount, meaning:

* data persists between container restarts
* data is shared between the container and your local environment
* you can inspect the database file directly

---

## 🔄 Resetting the Database

To reset the data:

```bash
docker compose down -v
docker compose run --rm backend python -m app.ingest
```

This will:

* remove existing containers and volumes
* recreate the database from scratch


## 🔧 Development Notes

* Frontend runs on Vite dev server (port 5173)
* Backend runs on Uvicorn (port 8000)
* Node version ≥ 20 required for Vite
* Python 3.11 used for backend

---

## 📸 Future Improvements

* Switch to PostgreSQL for production use
* Add authentication
* Improve UI/UX
* Deploy to cloud environment

---

## 📌 Author

Anastasija Draskovic
