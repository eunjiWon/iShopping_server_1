# -*- coding: utf-8 -*-
# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys
import time

import numpy as np
import tensorflow as tf

import os
#import re
import pymongo
from bson.objectid import ObjectId 
   
connection = pymongo.MongoClient("localhost")
db = connection.iShopping
collection = db.uniqlo

def load_graph(model_file):
  graph = tf.Graph()
  graph_def = tf.GraphDef()

  with open(model_file, "rb") as f:
    graph_def.ParseFromString(f.read())
  with graph.as_default():
    tf.import_graph_def(graph_def)

  return graph

def read_tensor_from_image_file(file_name, input_height=299, input_width=299,
				input_mean=0, input_std=255):
  input_name = "file_reader"
  output_name = "normalized"
  file_reader = tf.read_file(file_name, input_name)
  if file_name.endswith(".png"):
    image_reader = tf.image.decode_png(file_reader, channels = 3,
                                       name='png_reader')
  elif file_name.endswith(".gif"):
    image_reader = tf.squeeze(tf.image.decode_gif(file_reader,
                                                  name='gif_reader'))
  elif file_name.endswith(".bmp"):
    image_reader = tf.image.decode_bmp(file_reader, name='bmp_reader')
  else:
    image_reader = tf.image.decode_jpeg(file_reader, channels = 3,
                                        name='jpeg_reader')
  float_caster = tf.cast(image_reader, tf.float32)
  dims_expander = tf.expand_dims(float_caster, 0)
  resized = tf.image.resize_bilinear(dims_expander, [input_height, input_width])
  normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])
  sess = tf.Session()
  result = sess.run(normalized)

  return result

def load_labels(label_file):
  label = []
  proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
  for l in proto_as_ascii_lines:
    label.append(l.rstrip())
  return label

if __name__ == "__main__":
  file_name = "/home/ubuntu/iShopping_server_1/uploads/image-1524730576623"
  model_file = "home/ubuntu/iShopping_server_1/tf_files_category/retrained_graph.pb"
  label_file = "home/ubuntu/iShopping_server_1/tf_files_category/retrained_labels.txt"
  input_height = 224
  input_width = 224
  input_mean = 128
  input_std = 128
  input_layer = "input"
  output_layer = "final_result"

  parser = argparse.ArgumentParser()
  parser.add_argument("--image", help="image to be processed")
  parser.add_argument("--graph", help="graph/model to be executed")
  parser.add_argument("--labels", help="name of file containing labels")
  parser.add_argument("--input_height", type=int, help="input height")
  parser.add_argument("--input_width", type=int, help="input width")
  parser.add_argument("--input_mean", type=int, help="input mean")
  parser.add_argument("--input_std", type=int, help="input std")
  parser.add_argument("--input_layer", help="name of input layer")
  parser.add_argument("--output_layer", help="name of output layer")
  parser.add_argument("--option_number", type=int, help="catetory:1, color:2")
  parser.add_argument("--output_file", help="output file")
  args = parser.parse_args()

  if args.graph:
    model_file = args.graph
    print(model_file)
  if args.image:
    file_name = args.image
    print(file_name)
  if args.labels:
    label_file = args.labels
  if args.input_height:
    input_height = args.input_height
  if args.input_width:
    input_width = args.input_width
  if args.input_mean:
    input_mean = args.input_mean
  if args.input_std:
    input_std = args.input_std
  if args.input_layer:
    input_layer = args.input_layer
  if args.output_layer:
    output_layer = args.output_layer
  #add option number, category:1, color:2 
  if args.option_number:
    option_number = args.option_number
  if args.output_file:
    outputFile = args.output_file
  else:
    outputFile = os.path.join(os.pardir,'/','t.txt')  
  
  print(model_file)
  #define output file according to option num
  
  
 # if option_number == 1:
 #   outputFile = os.path.join(os.pardir,'/','t.txt')
    #model_file = os.pardir+'/'+'tf_files_category/retrained_graph.pb'
    #label_file = os.pardir+'/'+'tf_files_category/retrained_labels.txt'
 # elif option_number == 2:
  #  outputFile = os.pardir+'/'+'iShopping_server_1/t1.txt'
    #model_file = os.pardir+'/'+'tf_files_color/retrained_graph.pb'
    #label_file = os.pardir+'/'+'tf_files_color/retrained_labels.txt'



  graph = load_graph(model_file)
  t = read_tensor_from_image_file(file_name,
                                  input_height=input_height,
                                  input_width=input_width,
                                  input_mean=input_mean,
                                  input_std=input_std)

  input_name = "import/" + input_layer
  output_name = "import/" + output_layer
  input_operation = graph.get_operation_by_name(input_name)
  output_operation = graph.get_operation_by_name(output_name)

  with tf.Session(graph=graph) as sess:
    start = time.time()
    results = sess.run(output_operation.outputs[0],
                      {input_operation.outputs[0]: t})
    end=time.time()
  results = np.squeeze(results)

  top_k = results.argsort()[-5:][::-1]
  labels = load_labels(label_file)

  print('\nEvaluation time (1-image): {:.3f}s\n'.format(end-start))

  for i in top_k:
    print(labels[i], results[i])

# label 파일에 쓰기	
_index = top_k[0]
var1 = labels[_index]
var2 = results[_index]
 
print("This is maybe ... " + var1)		
try: 
	f = open(outputFile, "w")
	f.write(
          labels[top_k[0]]+' '+str(results[top_k[0]])+'\n'
         +labels[top_k[1]]+' '+str(results[top_k[1]])+'\n'
         +labels[top_k[2]]+' '+str(results[top_k[2]])+'\n'
          )

except IOError:
	print("Error: can't find file or read data")
else:
	print("Written content in the file successfully")



