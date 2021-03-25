#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

echo ${service_account_key}

cd ${terraform_path}
terraform init
terraform plan
