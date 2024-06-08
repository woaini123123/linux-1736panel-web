#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin

if [ ! -f /www/server/mdserver-web/bin/activate ];then
    cd /www/server/mdserver-web && python3 -m venv .
    cd /www/server/mdserver-web && source /www/server/mdserver-web/bin/activate
else
    cd /www/server/mdserver-web && source /www/server/mdserver-web/bin/activate
fi

cn=$(curl -fsSL -m 10 http://ipinfo.io/json | grep "\"country\": \"CN\"")
PIPSRC="https://pypi.python.org/simple"
if [ ! -z "$cn" ];then
    PIPSRC="https://pypi.tuna.tsinghua.edu.cn/simple"
fi

cd /www/server/mdserver-web && pip3 install -r /www/server/mdserver-web/requirements.txt -i $PIPSRC

P_VER=`python3 -V | awk '{print $2}'`
P_VER_D=`echo "$P_VER"|awk -F '.' '{print $1}'`
P_VER_M=`echo "$P_VER"|awk -F '.' '{print $2}'`
NEW_P_VER=${P_VER_D}.${P_VER_M}

if [ -f /www/server/mdserver-web/version/r${NEW_P_VER}.txt ];then
    cd /www/server/mdserver-web && pip3 install -r /www/server/mdserver-web/version/r${NEW_P_VER}.txt -i $PIPSRC
fi