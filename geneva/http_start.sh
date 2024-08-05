#!/bin/bash
cd /www/server/mdserver-web && source ./bin/activate && iptables -I OUTPUT -p tcp --sport 80 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 100 && python geneva_cli.py http