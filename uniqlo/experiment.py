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

img =[
        ["sj_pants", "https://scene7.zumiez.com/is/image/zumiez/pdp_hero/Diamond-Supply-Co.-Speedway-Brown-Pants-_278929-front-US.jpg"],
        ["kj_tshirts", "http://image.musinsa.com/images/goods_img/20180503/772832/772832_1_500.jpg"],
        ["kj_jeans", "http://image-kr.uniqlo.com/goods/31/11/03/92/407399_COL_COL62_1000.jpg"],
        ["mj_hoodie", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/mj_hoodie.jpg?alt=media&token=81ee9ef0-e972-448d-82f1-e3eb8de618ba"],
        ["0","https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/0.jpg?alt=media&token=3c896ece-305a-4fd9-a335-a243a3438005"],
        ["1", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/1.jpg?alt=media&token=1ed9fa60-eabd-49e8-858a-71912fdf5cfc"],
        ["2", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/2.jpg?alt=media&token=73728791-bf49-43d4-a3e3-6eb2875145c9"],
        ["3", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/3.jpg?alt=media&token=fe941816-71f0-4bc6-a72a-f548e1405137"],
        ["4", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/4.jpg?alt=media&token=7e12fc96-3349-41b9-ad9a-349dc1db0018"],
        ["5", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/5.jpg?alt=media&token=49c19b92-1c19-4798-9d24-d95ebb6a7b90"],
        ["6", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/6.jpg?alt=media&token=adfa43c0-eb99-41b3-a583-50f0b9e8c134"],
        ["7", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/7.jpg?alt=media&token=abc82085-c81d-4ed6-8f19-ce88310ae569"],
        ["8", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/8.jpg?alt=media&token=11e6e69d-15c2-42f5-a44d-83641484cb7b"],
        ["9", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/9.jpg?alt=media&token=c4577519-b7bd-4c92-956b-2d9d22c7dd8a"],
        ["10", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/10.jpg?alt=media&token=0d5cb470-6629-41c4-a7f5-8d40390caec6"],
        ["11", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/11.jpg?alt=media&token=c5bfaa6a-b19a-4d16-8e92-70e5fdd11d02"],
        ["12", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/12.jpg?alt=media&token=e7e64d57-36d4-4b71-9db2-cb2b4e4bc64d"],
        ["13", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/13.jpg?alt=media&token=b9732124-8bed-4d59-a726-8d82485c76bf"],
        ["14", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/14.jpg?alt=media&token=df486be6-07aa-4d37-81d9-62a11e7e02d2"],
        ["15", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/15.jpg?alt=media&token=7a805f6a-1aa8-42ae-9135-33e4cc058d17"],
        ["16", "https://firebasestorage.googleapis.com/v0/b/allblue-ecca3.appspot.com/o/16.jpg?alt=media&token=5252993d-4260-4d48-b214-81958007b6a5"]
    ]

#uniqlo_info = storeCol.find_one({ name: "uniqlo" })
#store_id = uniqlo_info.get("_id")

#men category crawling


#root dir
rootDir = os.path.join(os.getcwd(), 'experiment_img')

# model dir
pardir = os.pardir
category_model_dir = os.path.abspath(os.path.join(os.pardir, 'tf_files_category', 'retrained_graph.pb'))
color_model_dir = os.path.abspath(os.path.join(os.pardir, 'tf_files_color', 'retrained_graph.pb'))


for i in img:

    #name, pirce는 동일
    img_name = i[0]
    img_price = '3000'
    img_url = i[1]
    img_size = "XS-XL"
    print(img_name, img_url)

    img_dir = rootDir+'/'+img_name+'.jpg'

    #category
    sys.argv = ['--graph='+ category_model_dir, '--image='+img_dir,
    '--option_number=1']
    exec(open(pardir+'/'+'scripts/label_image.py').read())
    f = open(pardir+'/'+"t.txt", "r")

    img_shape.clear()
    img_percentage.clear()
    line = f.readline()
    while line:
        temp = line.split()
        img_shape.append(temp[0])
        img_percentage.append(temp[1])
        print(img_shape)
        line = f.readline()
    f.close()

    #color
    sys.argv = ['--graph='+ color_model_dir, '--image='+img_dir,'--option_number=2']
    exec(open(pardir+'/'+'scripts/label_image.py').read())
    f2 = open(pardir+'/'+"t1.txt", "r")

    img_shape.clear()
    img_percentage.clear()
    line = f.readline()
    temp = line.split()
    img_color = temp[0]

    f2.close()

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
                        "store_id": '5ae675567d0b98e5674ac60f'
    })

