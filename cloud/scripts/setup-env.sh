#!/usr/bin/env bash

apt-get update

apt-get install -y nodejs git npm
npm install -g @angular/cli

git clone https://github.com/dodopontocom/webids.git
cd webids/webids-a
git checkout wip-gcp
npm install
ng serve --host 0.0.0.0 --port 4200
