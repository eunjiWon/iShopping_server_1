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

#옷정보 -> clothes
#매장정보 -> store
clothesCol = db.clothes
storeCol = db.store

img_shape = []
img_percentage = []

#uniqlo_info = storeCol.find_one({ name: "uniqlo" })
#store_id = uniqlo_info.get("_id")

#men category crawling

#starting url
baseurl = "http://store-kr.uniqlo.com/display/displayShop.lecs?storeNo=83&siteNo=50706&displayNo=NQ1A13A07&displayMallNo=NQ1&stonType=P"
res = req.urlopen(baseurl)
print(res)

#root dir
rootDir = os.path.join(os.getcwd(), 'uniqlo_img')

# model dir
pardir = os.pardir
model_dir = os.path.abspath(os.path.join(os.pardir, 'tf_files_category', 'retrained_graph.pb'))


soup = BeautifulSoup(res, "html.parser")

#첫 페이지에서 -> men category
a_list = soup.select("div.gnb_2016_col.col3 > div.col_block > ul a")

#print(a_list)
for a in a_list:
    
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
            
            img_size = "XS-XL"
            print(img_name, img_price, img_url, img_size)
            url = re.sub('[-=.#/?:$}]', '', img_url)

            img_dir = rootDir+'/'+url+'.jpg'
            print(img_dir)
            req.urlretrieve(img_url,rootDir+ '/' +  url +  '.jpg')
            
            sys.argv = ['--graph='+model_dir, '--image='+img_dir,
            '--option_number=1']

            exec(open(pardir+'/'+'scripts/label_image.py').read())
            f = open(pardir+'/'+"t.txt", "r")

            print(str(f))
            img_shape.clear()
            img_percentage.clear()
            line = f.readline()
            img_shape = []

            while line:
                temp = line.split()
                img_shape.append(temp[0])
                img_percentage.append(temp[1])
                print(img_shape)
                line = f.readline()
            
            
            clothesCol.insert({"name": img_name, 
                               "price": img_price, 
                               "url": img_url,
                               "size": img_size,
                               "color": img_color,
                               "shape": img_shape[0],
                               "shape1": img_shape[1],
                               "shape2": img_shape[2],
                               "p": img_percentage[0],
                               "p1": img_percentage[1],
                               "p2": img_percentage[2],
                               "store_id": '5a7c10d53e57f0ee8c48f8de'
            })
            
