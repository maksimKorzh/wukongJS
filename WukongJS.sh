#!/bin/bash

BASEDIR=$(dirname "$0")
cd $BASEDIR
exec nodejs wukong.js
