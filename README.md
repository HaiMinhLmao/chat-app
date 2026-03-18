## chat-app

### Run with Docker (recommended)

1) Install Docker Desktop

2) Set Supabase key and start:

```powershell
cd d:\chat-app
$env:SUPABASE_ANON_KEY="sb_publishable_..."
docker compose up --build
```

Open `http://localhost:8080/login.html`.

### Run without Docker

```powershell
cd d:\chat-app
$env:SUPABASE_ANON_KEY="sb_publishable_..."
.\mvnw.cmd spring-boot:run
```

