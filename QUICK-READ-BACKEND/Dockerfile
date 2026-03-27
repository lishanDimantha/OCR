# පළමු පියවර: Build Stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Dependency ගොනු කොපි කිරීම
COPY go.mod go.sum ./
RUN go mod download

# සම්පූර්ණ source code එක කොපි කිරීම
COPY . .

# Application එක build කිරීම
RUN CGO_ENABLED=0 GOOS=linux go build -o quick-read-api .

# දෙවන පියවර: Runtime Stage
FROM alpine:latest  

# HTTPS requests සඳහා අවශ්‍ය සහතික එකතු කිරීම
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Builder stage එකෙන් binary එක පමණක් ලබා ගැනීම
# (.env ගොනුව කොපි කිරීම ඉවත් කර ඇත)
COPY --from=builder /app/quick-read-api .

# Port එක expose කිරීම
EXPOSE 8080

# Binary එක run කිරීම
CMD ["./quick-read-api"]