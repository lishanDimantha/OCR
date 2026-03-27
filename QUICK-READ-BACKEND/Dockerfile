# පළමු පියවර: Go 1.25 භාවිතා කර binary එක build කිරීම
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Dependency ගොනු කොපි කිරීම
COPY go.mod go.sum ./

# Dependencies download කිරීම
RUN go mod download

# සම්පූර්ණ source code එක කොපි කිරීම
COPY . .

# Application එක build කිරීම (CGO අක්‍රිය කර නිපදවන නිසා alpine වල හොඳින් වැඩ කරයි)
RUN CGO_ENABLED=0 GOOS=linux go build -o quick-read-api .

# දෙවන පියවර: කුඩා image එකක් (Runtime) ලෙස සකස් කිරීම
FROM alpine:latest  

# HTTPS requests සඳහා අවශ්‍ය සහතික එකතු කිරීම
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Builder stage එකෙන් binary එක සහ .env ගොනුව පමණක් ලබා ගැනීම
COPY --from=builder /app/quick-read-api .
COPY --from=builder /app/.env .

# Port එක expose කිරීම
EXPOSE 8080

# Binary එක run කිරීම
CMD ["./quick-read-api"]