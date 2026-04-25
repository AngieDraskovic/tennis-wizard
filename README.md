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

### 2. Run the application with Docker

```bash
docker compose run --rm backend python -m app.ingest
docker compose up --build
```

---

### 3. Access the app

* Frontend → http://localhost:5173
* Backend API docs → http://localhost:8000/docs

---

## 🧠 How It Works

* Backend runs a FastAPI server exposing endpoints for tennis data
* Frontend consumes the API and displays player statistics
* SQLite is used as a lightweight local database
* Docker Compose orchestrates both services
* Volumes are used for hot reload during development

---

## 🗄️ Database

The project uses SQLite for simplicity:

```python
engine = create_engine(
    f"sqlite:///{settings.db_path}",
    future=True
)
```

The database file is stored locally and persists between runs.

---

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
