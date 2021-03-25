#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

echo 1
echo ${service_account_key}
echo 2
echo ${secrets.WEBIDS_GCP_SA}
#echo ${service_account_key} > ${TF_VAR_key}

#cd ${terraform_path}
#terraform init
#terraform plan
