#!/bin/bash
HTTP_RULE="-p tcp -m tcp --sport 80 --tcp-flags FIN,SYN,RST,PSH,ACK SYN,ACK -j NFQUEUE --queue-num 100"
if iptables -C OUTPUT $HTTP_RULE 2>/dev/null; then
    echo "Rule $HTTP_RULE already exists."
else
    iptables -A OUTPUT $HTTP_RULE
    echo "Rule added."
fi

HTTPS_RULE="-p tcp -m tcp --sport 443 --tcp-flags FIN,SYN,RST,PSH,ACK SYN,ACK -j NFQUEUE --queue-num 101"
if iptables -C OUTPUT $HTTPS_RULE 2>/dev/null; then
    echo "Rule $HTTPS_RULE already exists."
else
    iptables -A OUTPUT $HTTPS_RULE
    echo "Rule added."
fi