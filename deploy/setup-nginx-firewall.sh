#!/usr/bin/env bash
# Open HTTP on VM + nginx reverse proxy to spark-gen (port 3000).
set -euo pipefail

if ! iptables -C INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT 2>/dev/null; then
  iptables -I INPUT 5 -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
  echo "Opened iptables port 80"
fi

if ! grep -q 'dport 80 -j ACCEPT' /etc/iptables/rules.v4; then
  sed -i '/-A INPUT -p tcp -m state --state NEW -m tcp --dport 3000 -j ACCEPT/a -A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT' /etc/iptables/rules.v4
  echo "Persisted iptables port 80"
fi

cat > /etc/nginx/sites-available/spark-gen <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/spark-gen /etc/nginx/sites-enabled/spark-gen
nginx -t
systemctl reload nginx

echo "nginx: $(systemctl is-active nginx)"
iptables -L INPUT -n | grep -E 'dpt:(80|3000)' || true
curl -s -o /dev/null -w 'nginx local /login: %{http_code}\n' http://127.0.0.1/login