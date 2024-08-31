#!/bin/bash

# Check if lo interface has 127.0.0.1 assigned
if ifconfig lo | grep -q "127.0.0.1"; then
    echo "Loopback interface 'lo' has IP address 127.0.0.1."
else
    echo "Loopback interface 'lo' does not have IP address 127.0.0.1."
    echo "Assigning 127.0.0.1 to loopback interface 'lo'..."
    # Assign 127.0.0.1 to lo interface
    sudo ifconfig lo 127.0.0.1 netmask 255.0.0.0 up
    if [ $? -eq 0 ]; then
        echo "Successfully assigned 127.0.0.1 to loopback interface 'lo'."
    else
        echo "Failed to assign 127.0.0.1 to loopback interface 'lo'."
    fi
fi
