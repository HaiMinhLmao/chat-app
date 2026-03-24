## chat-app

### Requirements

- Java 21 (LTS)
- Docker Desktop (if running with Docker)

### Run with Docker (recommended)

1) Install Docker Desktop

2) Set Supabase key and start:

```powershell
cd d:\chat-app
$env:SUPABASE_ANON_KEY="sb_publishable_..."
$env:SUPABASE_DB_JDBC_URL="jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USERNAME="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="your-db-password"
docker compose up --build
```

Open `http://localhost:8080/login.html`.

### Run without Docker

```powershell
cd d:\chat-app
java -version
$env:SUPABASE_ANON_KEY="sb_publishable_..."
$env:SUPABASE_DB_JDBC_URL="jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USERNAME="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="your-db-password"
.\mvnw.cmd spring-boot:run
```

