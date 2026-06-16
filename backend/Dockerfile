# ---- build ----
FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# api is the server; the seed* binaries are run on-demand (docker compose run)
RUN CGO_ENABLED=0 go build -o /out/api        ./cmd/api && \
    CGO_ENABLED=0 go build -o /out/seed       ./cmd/seed && \
    CGO_ENABLED=0 go build -o /out/seed-admin ./cmd/seed-admin && \
    CGO_ENABLED=0 go build -o /out/seed-quests ./cmd/seed_quests

# ---- run ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates && adduser -D -u 10001 app
WORKDIR /app
COPY --from=build /out/ /app/
# lesson/quest seed data — needed only by the seed* binaries, harmless for api
COPY data ./data
# uploads is a mounted volume in prod; create it so the dir exists on first run
RUN mkdir -p /app/uploads && chown -R app:app /app
USER app
EXPOSE 8080
ENV GIN_MODE=release
CMD ["/app/api"]
