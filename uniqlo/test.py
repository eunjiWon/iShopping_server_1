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
uniqlo_info = storeCol.find_one({ "name": "uniqlo" }) 
print(uniqlo_info.get('_id')) 
