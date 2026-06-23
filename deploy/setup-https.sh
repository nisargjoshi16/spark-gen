#!/usr/bin/env bash
# Enable HTTPS via Let's Encrypt + nginx reverse proxy to spark-gen.
# Requires Oracle Security List ingress for TCP 80 and 443.
#
# Usage:
#   sudo bash deploy/setup-https.sh
#   sudo DOMAIN=spark.prachodayat.in bash deploy/setup-https.sh
set -euo pipefail

DOMAIN="${DOMAIN:-80-225-209-167.sslip.io}"
EMAIL="${CERTBOT_EMAIL:-nisargjoshi@outlook.com}"
APP_PORT="${APP_PORT:-3000}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/setup-https.sh" >&2
  exit 1
fi

open_port() {
  local port="$1"
  if ! iptables -C INPUT -p tcp -m state --state NEW -m tcp --dport "${port}" -j ACCEPT 2>/dev/null; then
    iptables -I INPUT 5 -p tcp -m state --state NEW -m tcp --dport "${port}" -j ACCEPT
    echo "Opened iptables port ${port}"
  fi
  if ! grep -q "dport ${port} -j ACCEPT" /etc/iptables/rules.v4; then
    sed -i "/-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT/a -A INPUT -p tcp -m state --state NEW -m tcp --dport ${port} -j ACCEPT" /etc/iptables/rules.v4
    echo "Persisted iptables port ${port}"
  fi
}

echo "==> Domain: ${DOMAIN}"
open_port 80
open_port 443

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y certbot python3-certbot-nginx

cat > /etc/nginx/sites-available/spark-gen <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 20M;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}
NGINX

mkdir -p /var/www/certbot
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/spark-gen /etc/nginx/sites-enabled/spark-gen
nginx -t
systemctl reload nginx

if [[ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]]; then
  curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    -o /etc/letsencrypt/options-ssl-nginx.conf
fi
if [[ ! -f /etc/letsencrypt/ssl-dhparams.pem ]]; then
  openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

echo "==> Requesting certificate (needs ports 80+443 reachable from the internet)"
certbot certonly \
  --webroot -w /var/www/certbot \
  -d "${DOMAIN}" \
  --email "${EMAIL}" \
  --agree-tos \
  --non-interactive \
  --keep-until-expiring

cat > /etc/nginx/sites-available/spark-gen <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 20M;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

nginx -t
systemctl reload nginx

# Renew hook
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'HOOK'
#!/usr/bin/env bash
systemctl reload nginx
HOOK
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo ""
echo "HTTPS ready: https://${DOMAIN}/"
echo "Update ~/spark-gen/.env: remove COOKIE_SECURE=false (or set COOKIE_SECURE=true)"
echo "Then: sudo systemctl restart spark-gen"