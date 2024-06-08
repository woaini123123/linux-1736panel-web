"""
server for serving index of all plugins
"""
import json
import os
from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    """
    plugins index
    """
    aggregated_data = []
    root_dir = '/var/www/html/plugins'
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename == 'info.json':
                json_path = os.path.join(dirpath, filename)
                with open(json_path, 'r') as json_file:
                    data = json.load(json_file)
                    aggregated_data.append(data)
    
    return jsonify(aggregated_data)

if __name__ == '__main__':
    app.run()
