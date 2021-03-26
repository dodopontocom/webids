#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
echo "${WEBIDS_GCP_SA}" > ${GCLOUD_JSON_KEY_PATH}

terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"
hasBucket=false

[[ $(gsutil iam get gs://${GCLOUD_APP_BUCKET_NAME}) ]] && hasBucket=true

if [[ "${hasBucket}" -eq "true" ]]; then
    cd ${terraform_path}
    terraform init --backend-config="bucket=${GCLOUD_APP_BUCKET_NAME}" --backend-config="prefix=tf-state"
    terraform plan
    #terraform apply --auto-approve
fi
