#!/bin/sh

# Remplacer les URL dynamiques fournies par Render
if [ -n "$ACCOUNT_SERVICE_HOST" ]; then
    sed -i "s/__ACCOUNT_SERVICE_HOST__/${ACCOUNT_SERVICE_HOST}/g" /etc/nginx/nginx.conf
fi
if [ -n "$TRANSACTION_SERVICE_HOST" ]; then
    sed -i "s/__TRANSACTION_SERVICE_HOST__/${TRANSACTION_SERVICE_HOST}/g" /etc/nginx/nginx.conf
fi

# Démarrer Nginx
exec nginx -g 'daemon off;'
