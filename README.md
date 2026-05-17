# 🎮 GameVault — Digital Games Catalog

Full-stack web application: **Spring Boot (Java) + React**.  
Designed for AWS deployment: ECS Fargate, RDS, API Gateway, Lambda.

---

## Architecture

```
[React Frontend]  →  [API Gateway]  →  [Spring Boot on ECS]  →  [RDS MySQL]
                                ↘
                              [Lambda /report]
```

---

## Quick Start (local dev)

### Option A — Docker Compose (recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:8080
- H2 Console: http://localhost:8080/h2-console

### Option B — Run separately

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
# API running at http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/games`        | List all games           |
| GET    | `/api/games?search=` | Search games            |
| GET    | `/api/games/{id}`   | Get game by ID           |
| POST   | `/api/games`        | Create new game          |
| PUT    | `/api/games/{id}`   | Update game              |
| DELETE | `/api/games/{id}`   | Delete game              |
| GET    | `/api/games/report` | Stats (for Lambda)       |

### POST /api/games — Request body example
```json
{
  "title": "Elden Ring",
  "genre": "Action RPG",
  "developer": "FromSoftware",
  "publisher": "Bandai Namco",
  "platform": "PlayStation 5",
  "releaseDate": "2022-02-25",
  "price": 249.99,
  "rating": 9.4,
  "description": "Rise, Tarnished!",
  "isAvailable": true
}
```

---

## AWS Deployment

### Switch from H2 → RDS MySQL
In `backend/src/main/resources/application.properties`, comment the H2 block and uncomment MySQL:
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST}:3306/gamesdb?useSSL=false&serverTimezone=UTC
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

Set `DB_HOST`, `DB_USER`, `DB_PASSWORD` as environment variables in your ECS Task Definition.

### ECS Fargate — Backend
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t gamevault-backend ./backend
docker tag gamevault-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/gamevault-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/gamevault-backend:latest
```

### ECS Fargate — Frontend
```bash
docker build --build-arg REACT_APP_API_URL=https://<api-gateway-url>/prod/api -t gamevault-frontend ./frontend
docker tag gamevault-frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/gamevault-frontend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/gamevault-frontend:latest
```

### API Gateway
- Route ALL CRUD requests → Backend ECS (HTTP integration)
- Route `GET /report` → Lambda function

### Lambda /report
The Lambda should call `GET http://<backend-internal-url>/api/games/report` and return the JSON response.

---

## Project Structure

```
games-catalog/
├── backend/
│   ├── src/main/java/com/gamescatalog/
│   │   ├── GamesCatalogApplication.java
│   │   ├── controller/GameController.java     # REST endpoints
│   │   ├── service/GameService.java           # Business logic
│   │   ├── repository/GameRepository.java     # JPA queries
│   │   ├── model/Game.java                    # Entity
│   │   ├── dto/GameDTO.java                   # Request/Response DTOs
│   │   ├── exception/                         # Error handling
│   │   └── config/                            # CORS, DataSeeder
│   ├── src/main/resources/
│   │   └── application.properties             # DB config (H2/MySQL/Postgres)
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                            # Main component
│   │   ├── App.css                            # Design system
│   │   ├── index.js                           # Entry point
│   │   ├── services/jogoService.js            # Axios API client
│   │   ├── hooks/useJogos.js                  # State management
│   │   └── components/
│   │       ├── JogoCard.jsx                   # Game card
│   │       ├── JogoModal.jsx                  # Create/Edit form
│   │       ├── JogoDetalhes.jsx               # Detail view
│   │       └── ConfirmDialog.jsx              # Delete confirmation
│   ├── public/index.html
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```
