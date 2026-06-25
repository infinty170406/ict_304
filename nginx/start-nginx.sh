#!/bin/sh

# Fallbacks au cas où les variables d'environnement de Render soient vides
ACCOUNT_HOST=${ACCOUNT_SERVICE_HOST:-"account-service-6db9.onrender.com"}
TRANSACTION_HOST=${TRANSACTION_SERVICE_HOST:-"transaction-service-lyn1.onrender.com"}
LISTEN_PORT=${PORT:-80}

# Déterminer le protocole et le port pour Account Service
# Si ACCOUNT_HOST contient un point '.', c'est une URL publique (ex: onrender.com)
if echo "$ACCOUNT_HOST" | grep -q "\."; then
    ACCOUNT_URL="https://${ACCOUNT_HOST}"
else
    ACCOUNT_URL="http://${ACCOUNT_HOST}:8081"
fi

# Déterminer le protocole et le port pour Transaction Service
if echo "$TRANSACTION_HOST" | grep -q "\."; then
    TRANSACTION_URL="https://${TRANSACTION_HOST}"
else
    TRANSACTION_URL="http://${TRANSACTION_HOST}:8082"
fi

# Remplacer les placeholders dans nginx.conf
sed -i "s|__ACCOUNT_SERVICE_URL__|${ACCOUNT_URL}|g" /etc/nginx/nginx.conf
sed -i "s|__ACCOUNT_SERVICE_HOST__|${ACCOUNT_HOST}|g" /etc/nginx/nginx.conf

sed -i "s|__TRANSACTION_SERVICE_URL__|${TRANSACTION_URL}|g" /etc/nginx/nginx.conf
sed -i "s|__TRANSACTION_SERVICE_HOST__|${TRANSACTION_HOST}|g" /etc/nginx/nginx.conf

# Render fournit le port via $PORT
sed -i "s|__PORT__|${LISTEN_PORT}|g" /etc/nginx/nginx.conf

# Démarrer Nginx
exec nginx -g 'daemon off;'
