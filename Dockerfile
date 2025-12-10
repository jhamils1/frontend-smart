# Etapa 1: Build de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Definir ARG para recibir variables de entorno en tiempo de build
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Construir la aplicación con las variables de entorno
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Instalar envsubst para reemplazar variables de entorno
RUN apk add --no-cache gettext

# Copiar los archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx (template)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar script de inicio
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer el puerto (Railway asignará un puerto dinámico)
EXPOSE 80

# Usar el script de inicio que configura nginx con el puerto correcto
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

