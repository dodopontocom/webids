#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

cd ${terraform_path}
terraform init --backend-config="bucket=test" --backend-config="prefix=tf-state"
terraform plan
#terraform apply --auto-approve
