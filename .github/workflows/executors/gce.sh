#!/usr/bin/env bash

echo ${GITHUB_WORKSPACE}
source ${GITHUB_WORKSPACE}/.workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

cd ${terraform_path}
terraform plan
