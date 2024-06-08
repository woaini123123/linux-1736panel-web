import sys
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def download_folder(url, local_dir):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        if not os.path.exists(local_dir):
            os.makedirs(local_dir)

        for link in soup.find_all('a'):
            href = link.get('href')
            if href == '../':
                continue
            if href.endswith('/'):  # if href is a directory
                subdir = os.path.join(local_dir, href.split('/')[-2])
                download_folder(urljoin(url, href), subdir)
            else:  # if href is a file
                file_url = urljoin(url, href)
                with open(os.path.join(local_dir, href.split('/')[-1]), 'wb') as file:
                    file.write(requests.get(file_url).content)
        print(f"Folder downloaded successfully to: {local_dir}")
    else:
        print(f"Failed to download folder from {url}")


arguments = sys.argv
source = arguments[1]
dest = arguments[2]
# download_folder("http://154.9.226.230/plugins/backup_ftp/", "/www/server/mdserver-web/plugins/backup_ftp")
download_folder(source, dest)
