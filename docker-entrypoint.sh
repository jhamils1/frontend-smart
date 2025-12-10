#!/bin/sh
set -e

# Si PORT no está definido, usar 80 por defecto
export PORT=${PORT:-80}

# Reemplazar variables en el template de nginx
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Ejecutar el comando original
exec "$@"

