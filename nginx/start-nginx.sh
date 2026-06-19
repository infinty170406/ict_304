#!/bin/sh
# Remplacer les variables d'environnement dans le fichier de configuration Nginx
envsubst '${ACCOUNT_SERVICE_URL} ${TRANSACTION_SERVICE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Démarrer Nginx
exec nginx -g 'daemon off;'
