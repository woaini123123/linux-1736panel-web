#!/bin/bash
cp /www/server/mdserver-web/scripts/speed/speed_check.service /usr/lib/systemd/system/speed_check.service
cp /www/server/mdserver-web/scripts/speed/speed_check.timer /usr/lib/systemd/system/speed_check.timer
systemctl daemon-reload
systemctl enable speed_check.timer
systemctl restart speed_check.timer