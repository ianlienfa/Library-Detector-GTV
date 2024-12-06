from bs4 import BeautifulSoup
import requests
import logging
import json

DEBUG = False
DEP_JSON_FILE = './dep-option.json'
TEMPLATE_INDEX_HTML_FILE = './dist/index.html'
DEST_INDEX_HTML_FILE = './dist/index.html'

def get_cdn_urls(package_name, version=None):
    CDN_NPM_PREFIX = "https://cdn.jsdelivr.net/npm/"
    CDN_PREFIX = "https://cdn.jsdelivr.net"
    NPM_VERSION_SEARCH_PREFIX = "https://data.jsdelivr.com/v1/packages/npm/"

    if version:
        dir_url = f"{CDN_NPM_PREFIX}{package_name}@{version}/dist/"
    else:
        dir_url = f"{CDN_NPM_PREFIX}{package_name}/dist/" # omit the version if not provided        
    r = requests.get(dir_url)
    file_urls = {"original": [], "min": [], "srcmap": [], "other": []}   
    if(DEBUG):
        print("dir_url: ", dir_url)
    if(r.status_code == 200):
        soup = BeautifulSoup(r.text, 'html.parser')
        listing_div = soup.find('div', class_='listing')
        a_tags = listing_div.find_all('a')
        if(DEBUG):
            print('a_tags: ', a_tags)
        # strip the .js out of the package name
        package_name_prefix = package_name.replace('.js', '')
        for a in a_tags:
            if a['href'].endswith(f'{package_name}.min.js'):
                file_urls['min'].append(CDN_PREFIX + a['href'])
            elif a['href'].endswith(f"{package_name}.js") or a['href'].endswith(f"{package_name_prefix}.js"):                
                file_urls['original'].append(CDN_PREFIX + a['href'])
            elif a['href'].endswith('.map'):
                file_urls['srcmap'].append(CDN_PREFIX + a['href'])
            else:
                file_urls['other'].append(CDN_PREFIX + a['href'])        
    if(len(file_urls['original']) == 0 or r.status_code != 200):
        if(DEBUG):
            print(f"{package_name}@{version} not found at {dir_url}. Using alternative search.")
        search_url = f"{NPM_VERSION_SEARCH_PREFIX}{package_name}"
        if(DEBUG):
            print('Searching at ', search_url)
        if not version: # search for latest version
            r = requests.get(search_url)
            if(r.status_code != 200):
                logging.error(f"Failed to get the cdn urls for {package_name}@{version}, url: {dir_url}, status code: {r.status_code}")
                return None
            version_json = r.json()
            version = version_json['tags']['latest']
        entry_point_url = f"{NPM_VERSION_SEARCH_PREFIX}{package_name}@{version}/entrypoints"        
        r = requests.get(entry_point_url)
        if(r.status_code != 200):
            logging.error(f"Failed to get the cdn urls for {package_name}@{version}, url: {dir_url}, status code: {r.status_code}")
            return None        
        entry_point = r.json()['entrypoints']
        if 'js' not in entry_point:
            logging.error(f"{package_name} might not be a js library?")
            return None
        entry_point_file_name = entry_point['js']['file']
        file_urls['original'].append(f"{CDN_NPM_PREFIX}{package_name}@{version}{entry_point_file_name}")
    return file_urls
        

def get_cdn_link(package_name, version=None, file_type='original'):
    """! get cdn link for a package
    @param package_name   The name of the package
    @param version        The version to the package, if not provided, the latest version will be used.
    @param file_type      The type of file to get. Options are 'original', 'min', 'srcmap'
    @return               The cdn link for the package
    """    
    urls = get_cdn_urls(package_name, version)
    if(DEBUG):
        print('urls: ', urls)
    supported_file_types = ['original', 'min', 'srcmap']
    if urls:
        if(file_type not in supported_file_types):
            logging.error(f"Unsupported file type. Supported types are {supported_file_types}.")
            return None
        if(urls[file_type] == []):
            logging.warning(f"No {file_type} file found.")
            return None
        if(len(urls[file_type]) > 1):
            logging.warning(f"Multiple {file_type} files found. Returning the first one.")
        return urls[file_type][0]
    logging.warning(f"No files found for {package_name}@{version}")
    return None

# parse the json dep options
with open(DEP_JSON_FILE, 'r') as f:
    dep_options = json.load(f)
    print('CDN Dependecies:', dep_options)

# parse the html file
soup = None
html_prep = """
    <meta charset="utf-8"/>
"""
with open(TEMPLATE_INDEX_HTML_FILE, 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')    
    for name, val in dep_options['cdn'].items():
        if 'version' not in val:
            val['version'] = None
        if 'type' not in val:
            val['type'] = 'original'
        lib_cdn_link = get_cdn_link(name, val['version'], val['type'])
        html_prep += f'<script src="{lib_cdn_link}"></script>\n'
    soup.head.clear()
    soup.head.append(BeautifulSoup(html_prep, 'html.parser'))    

with open(DEST_INDEX_HTML_FILE, 'w') as f:
    f.write(str(soup))
    print("Updated the html file with cdn links.")
