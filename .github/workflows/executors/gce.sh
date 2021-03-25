#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"

gsutil iam get gs://${GCLOUD_APP_BUCKET_NAME}

cd ${terraform_path}
terraform init --backend-config="bucket=${GCLOUD_APP_BUCKET_NAME}" --backend-config="prefix=tf-state"
terraform plan
#terraform apply --auto-approve
