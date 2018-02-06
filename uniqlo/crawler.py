# -*- coding: utf-8 -*- 

import pymongo
from bs4 import BeautifulSoup
import urllib.request as req
import urllib.parse as pr
import os, sys
from bs4 import BeautifulSoup
import re

connection = pymongo.MongoClient("localhost")
db = connection.iShopping
collection = db.uniqlo

#men category crawling

#starting url
baseurl = "http://www.uniqlo.kr/display/displayShop.lecs?storeNo=22&siteNo=9&displayMallNo=UQ1&displayNo=UQ1A02A01A15#UQ1A02A01A15A02"
res = req.urlopen(baseurl)
print(res)

#root dir
rootDir = os.path.join(os.getcwd(), 'uniqlo')

soup = BeautifulSoup(res, "html.parser")

#첫 페이지에서 -> men category
a_list = soup.select("div.gnb_2016_col.col3 > div.col_block > ul a")

#print(a_list)
for a in a_list:
    print("ㅇㅇ: " + a.string + a.get('href')+ '\n')
    #찾은 카테고리명으로 디렉토리 생성
    category = a.string
#    dirname = os.path.join(rootDir, a.string)
#    if not(os.path.isdir(dirname)):
#        os.mkdir(dirname) 
    #해당 카테고리 페이지로 이동
    url = pr.urljoin(baseurl, a.get('href'))

    res2 = req.urlopen(url)
    soup2 = BeautifulSoup(res2, "html.parser")
    #img, price
    item_list = soup2.select("ul.uniqlo_info > li.item")
    img_list = soup2.select("ul.uniqlo_info > li.item div.thumb > p > a > img")
    price_list = soup2.select("ul.uniqlo_info > li.item strong")
    #size_list = soup2.select("ul.uniqlo_info > li.item > div.color_chip > span")
    print("\nimg: " + str(len(img_list)) + "\nprice: " + str(len(price_list)))

    for item in item_list:
        
        #name, pirce는 동일
        img_name = item.select_one("span.name a").string
        img_name = re.sub("/","",img_name)
        img_price = item.select_one("strong.price").string
        price = re.split(',|원',item.select_one("strong.price").string)
        img_price = int(price[0] + price[1])
        

        #url, size, color, shape은 색깔별로
        itemsWithColor = item.select("ul.info_color")
        for ic in itemsWithColor:
            img_url = ic.select_one("li > a").get('data-image-path')
            img_color = ic.select_one("li > a > img").get('alt').split(' ')
            img_color = img_color[len(img_color)-1]
            img_shape = category
            img_size = "XS-XL"
            print(img_name, img_price, img_url, img_size)
            collection.insert({"name": img_name, 
                               "price": img_price, 
                               "url": img_url, 
                               "size": img_size,
                               "color": img_color,
                               "shape": img_shape,
                           })
            docs = collection.find_one({"url": img_url})
            #print(docs['_id'])
            req.urlretrieve(img_url, str(docs['_id']) +  '.jpg')
            print("insert in DB\n")            

       
