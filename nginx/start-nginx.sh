#!/bin/sh

# Extraire l'IP du résolveur DNS du système (fourni par Render)
RESOLVER=$(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf)

# S'il n'y a pas de résolveur trouvé, utiliser Google DNS par défaut
if [ -z "$RESOLVER" ] || [ "$RESOLVER" = " " ]; then
    RESOLVER="8.8.8.8"
fi

# Remplacer le placeholder __RESOLVER__ par la vraie IP dans la configuration Nginx
sed -i "s/__RESOLVER__/${RESOLVER}/g" /etc/nginx/nginx.conf

# Démarrer Nginx
exec nginx -g 'daemon off;'
