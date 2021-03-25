#!/usr/bin/env bash

terraform  --version
path="${GITHUB_WORKSPACE}/cloud"
cd ${path}
terraform plan
