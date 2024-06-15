iptables -F
iptables -I INPUT -j ACCEPT
iptables -I FORWARD -j ACCEPT
iptables -I OUTPUT -j ACCEPT
iptables -I OUTPUT -p tcp --sport 80 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 100
iptables -I OUTPUT -p tcp --sport 443 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 101