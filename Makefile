# Savr Project Makefile
# Usage: make <command>

.PHONY: help build up down restart logs clean rebuild backend frontend db db-shell db-logs db-reset adminer adminer-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all containers"
	@echo "  up        - Start all containers"
	@echo "  down      - Stop all containers"
	@echo "  restart   - Restart all containers"
	@echo "  logs      - Show logs from all containers"
	@echo "  clean     - Stop containers and remove volumes"
	@echo "  rebuild   - Rebuild all containers (no cache)"
	@echo "  backend   - Build and start only backend"
	@echo "  frontend  - Build and start only frontend"
	@echo "  dev       - Start in development mode with logs"
	@echo "  db        - Start only database"
	@echo "  db-shell  - Access database shell"
	@echo "  db-logs   - View database logs"
	@echo "  db-reset  - Reset database (remove all data)"
	@echo "  adminer   - Start Adminer web interface"
	@echo "  adminer-logs - View Adminer logs"

# Build all containers
build:
	docker-compose build

# Start all containers
up:
	docker-compose up -d

# Stop all containers
down:
	docker-compose down

# Restart all containers
restart:
	docker-compose restart

# Show logs from all containers
logs:
	docker-compose logs -f

# Clean up containers and volumes
clean:
	docker-compose down -v
	docker system prune -f

# Rebuild all containers (no cache)
rebuild:
	docker-compose build --no-cache

# Build and start only backend
backend:
	docker-compose build backend
	docker-compose up backend

# Build and start only frontend
frontend:
	docker-compose build frontend
	docker-compose up frontend

# Start only database
db:
	docker-compose up -d postgres

# Access database shell
db-shell:
	docker-compose exec postgres psql -U savr_user -d savr_db

# View database logs
db-logs:
	docker-compose logs -f postgres

# Reset database (remove all data)
db-reset:
	docker-compose down postgres
	docker volume rm savr_postgres_data
	docker-compose up -d postgres

# Development mode with logs
dev:
	docker-compose up

# Quick rebuild and restart backend
backend-rebuild:
	docker-compose build --no-cache backend
	docker-compose up -d backend

# Quick rebuild and restart frontend
frontend-rebuild:
	docker-compose build --no-cache frontend
	docker-compose up -d frontend

# Show container status
status:
	docker-compose ps

# Access backend shell
backend-shell:
	docker-compose exec backend bash

# Access frontend shell
frontend-shell:
	docker-compose exec frontend bash

# View backend logs only
backend-logs:
	docker-compose logs -f backend

# View frontend logs only
frontend-logs:
	docker-compose logs -f frontend

# Start Adminer web interface
adminer:
	docker-compose up -d adminer

# View Adminer logs
adminer-logs:
	docker-compose logs -f adminer
