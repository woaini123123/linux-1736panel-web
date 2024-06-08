rm -rf /tmp/Python-3.9.18
wget -P /tmp https://www.python.org/ftp/python/3.9.18/Python-3.9.18.tgz

cd /tmp && tar -xvf Python-3.9.18.tgz && cd Python-3.9.18 && \
./configure --enable-optimizations && \
make && make altinstall
ln -sf /usr/local/bin/python3.9 /usr/bin/python3
python3 -m ensurepip
