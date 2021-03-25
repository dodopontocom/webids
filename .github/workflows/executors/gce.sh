#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

cd ${terraform_path}
terraform plan
