# Docker dla QA — Środowiska bez "U Mnie Działa"

"U mnie działa" to zdanie które niszczy relacje w teamach. Docker jest odpowiedzią na problem różnych środowisk. Jako QA powinieneś rozumieć podstawy — nie żeby pisać Dockerfile, ale żeby nie być bezradny gdy coś się psuje w środowisku.

## Po Co QA Zna Docker?

1. **Powtarzalne środowiska testowe** — "u mnie działa" przestaje być wymówką
2. **Izolowanie bugów** — czy bug jest w kodzie czy w konfiguracji środowiska?
3. **Lokalne uruchamianie aplikacji** — testowanie bez pełnego backendu deweloperów
4. **CI/CD** — pipeline'y używają Dockera, musisz rozumieć co robią

## Podstawowe Koncepty

### Obraz (Image) vs Kontener (Container)
- **Obraz** = przepis (read-only, szablon)
- **Kontener** = uruchomiony przepis (działa, ma stan, można zatrzymać)

Analogia: obraz to klasa, kontener to instancja klasy.

### Dockerfile
Przepis na obraz:
```dockerfile
FROM node:20-alpine          # zacznij od obrazu Node.js
WORKDIR /app                 # katalog roboczy
COPY package.json .          # skopiuj pliki
RUN npm install              # zainstaluj zależności
COPY . .                     # skopiuj resztę kodu
EXPOSE 3000                  # udostępnij port
CMD ["npm", "start"]         # polecenie startowe
```

## Komendy Które Musisz Znać

```bash
# Pobierz i uruchom kontener
docker run -d -p 8080:80 nginx
# -d = detached (w tle)
# -p 8080:80 = przekieruj port 8080 hosta na port 80 kontenera

# Lista działających kontenerów
docker ps

# Lista wszystkich kontenerów (też zatrzymanych)
docker ps -a

# Logi kontenera (kluczowe dla QA!)
docker logs [container_id]
docker logs -f [container_id]  # -f = follow, live stream logów

# Wejdź do kontenera (debug)
docker exec -it [container_id] sh

# Zatrzymaj kontener
docker stop [container_id]

# Usuń kontener
docker rm [container_id]
```

## Docker Compose — Wiele Serwisów Razem

Większość aplikacji to wiele serwisów: frontend, backend, baza danych, cache.

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Uruchom wszystkie serwisy
docker compose up -d

# Sprawdź status
docker compose ps

# Logi wszystkich serwisów
docker compose logs -f

# Zatrzymaj wszystko
docker compose down
```

## Typowe Problemy QA w Środowiskach Docker

### "Aplikacja nie startuje"
```bash
docker compose logs backend
# Poszukaj: "Error", "Failed", "Cannot connect"
```

### "Baza danych nie jest dostępna"
```bash
docker compose ps
# Sprawdź czy kontener postgres jest "healthy" (nie tylko "Up")
```

### "Zmiana kodu nie jest widoczna"
Jeśli używasz volumes do bindowania kodu:
```bash
docker compose down && docker compose up -d  # restart
# Lub dla buildu:
docker compose build backend && docker compose up -d backend
```

### "Chcę wyczyścić wszystko i zacząć od nowa"
```bash
docker compose down -v  # -v usuwa też volumes (dane bazy!)
docker system prune -a  # usuwa wszystkie nieużywane obrazy
```

## Środowisko Testowe z Docker

Dobry setup QA:
```bash
# env.test.docker-compose.yml
version: '3.8'
services:
  app:
    image: myapp:staging
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: testdb
  
  seed:
    image: myapp:staging
    command: ["npm", "run", "db:seed"]
    depends_on:
      - db
```

Efekt: izolowane środowisko testowe z fresh danymi przy każdym uruchomieniu.
