iptable-restore < /www/server/iptables.rules
systemctl stop geneva_http.service
systemctl stop geneva_https.service