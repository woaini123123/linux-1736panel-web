# run this for aggregate all plugin info.json in one jsona
gunicorn -w 4 -b 0.0.0.0:81 main:app