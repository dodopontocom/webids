#!/usr/bin/env bash

apt-get update
apt-get install -y git nodejs npm

git clone https://github.com/dodopontocom/webids.git
cd webids/webids-a
git checkout wip-gcp

npm install -g @angular/cli
#npm install -g npm@6

npm install
ng serve --host 0.0.0.0 --port 4200 &
