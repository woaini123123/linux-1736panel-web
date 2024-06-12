iptables -F
iptables -I INPUT -j ACCEPT
iptables -I FORWARD -j ACCEPT
iptables -I OUTPUT -j ACCEPT