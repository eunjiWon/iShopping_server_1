from selenium import webdriver
from bs4 import BeautifulSoup
import pymongo
import time
import os, sys
import urllib.request as req
import urllib.parse as pr
import re
'''
#connecting mongodb
connection = pymongo.MongoClient("localhost")
db = connection.iShopping

#옷정보 -> clothes
#매장정보 -> store
clothesCol = db.clothes
storeCol = db.store
uniqlo_info = storeCol.find_one({ "name": 'spao' })
store_id = uniqlo_info.get("_id")
print(store_id)
'''
cwd = os.getcwd()
# chrome webdriver dir
driver = webdriver.Chrome(cwd + '/chromedriver')
driver.implicitly_wait(5)

# url access
# Category: women
driver.get('http://spao.elandmall.com/dispctg/initDispCtg.action?disp_ctg_no=1711333016')

# click paging buttons below clothes contents
buttons = driver.find_elements_by_css_selector('#page_idx > span > a')

for i in range(len(buttons)):
    
    b = driver.find_elements_by_css_selector('#page_idx > span > a')
    b[i].click()
    time.sleep(5)
    
    
    # passing page source to beautifulsoup object
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    # store all goods information (li tag has)
    goods_list = soup.select('div#goodsList > ul > li')
    print (len(goods_list))

    for goods in goods_list:
        img_name = goods.select_one('span.prod_nm').string
        img_url = 'http:' + goods.select_one('div.thumb > span > img').get('src')
        img_price = re.split(',',goods.select_one('span.c_price > strong').string)
        img_price = int(img_price[0]+img_price[1])
        img_size = "XS-XL"
        print(img_price)
        
        #color -> 학습으로 변경
        #img_color = img_color[len(img_color)-1]
        
        # store imgs to directory
        url = re.sub('[-=.#/?:$}]', '', img_url)
        req.urlretrieve(img_url, cwd + '/spao/' +  url +  '.jpg')
        '''
        sys.argv = ['--graph=/home/ubuntu/iShopping_server_1/tf_files/retrained_graph.pb', 
                cwd + '/spao/' +  url +  '.jpg',
                '--option_number=1']

        exec(open('/home/ubuntu/iShopping_server_1/scripts/label_image.py').read())
        f = open("/home/ubuntu/iShopping_server_1/t.txt", "r")
        img_shape = f.readline()
        print(img_shape)

        
        clothesCol.insert({
                "name": img_name, 
                "price": img_price, 
                "url": img_url, 
                "size": img_size,
                "color": img_color,
                "shape": img_shape,
                "store_id": store_id
        })
        '''
        

    
