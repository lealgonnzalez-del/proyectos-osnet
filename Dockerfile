# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm i

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar configuración nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build desde stage anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
