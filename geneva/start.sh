iptable-save > /www/server/iptables.rules
systemctl start geneva_http.service
systemctl start geneva_https.service
iptables -A OUTPUT -p tcp --sport 80 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 668
iptables -A OUTPUT -p tcp --sport 443 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 669