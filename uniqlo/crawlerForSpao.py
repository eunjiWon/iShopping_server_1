from selenium import webdriver
from bs4 import BeautifulSoup
import pymongo
import time
import os

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
        #img_url
        #
        goods.
        clothesCol.insert({
                "name": img_name, 
                "price": img_price, 
                "url": img_url, 
                "size": img_size,
                "color": img_color,
                "shape": img_shape,
                "store_id": store_id
        })
    

    
