#!/bin/sh

# Fallbacks au cas où les variables d'environnement de Render soient vides
ACCOUNT_HOST=${ACCOUNT_SERVICE_HOST:-"account-service-6db9.onrender.com"}
TRANSACTION_HOST=${TRANSACTION_SERVICE_HOST:-"transaction-service-lyn1.onrender.com"}

# Remplacer les URL dynamiques
sed -i "s/__ACCOUNT_SERVICE_HOST__/${ACCOUNT_HOST}/g" /etc/nginx/nginx.conf
sed -i "s/__TRANSACTION_SERVICE_HOST__/${TRANSACTION_HOST}/g" /etc/nginx/nginx.conf

# Démarrer Nginx
exec nginx -g 'daemon off;'
