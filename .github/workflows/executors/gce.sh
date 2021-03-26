#!/usr/bin/env bash

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
echo "${WEBIDS_GCP_SA}" > ${GCLOUD_JSON_KEY_PATH}

terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"
hasBucket=false

echo ${hasBucket}
gsutil ls gs://${GCLOUD_APP_BUCKET_NAME}
if [[ "$?" -eq "0" ]]; then
    echo ok
else
    gsutil mb -l ${GCLOUD_PROJECT_REGION} -p ${PROJECT_ID} -c standard gs://${GCLOUD_APP_BUCKET_NAME}
fi
echo ${hasBucket}
if [[ "${hasBucket}" -eq "true" ]]; then
    cd ${terraform_path}
    terraform init --backend-config="bucket=${GCLOUD_APP_BUCKET_NAME}" --backend-config="prefix=tf-state"
    terraform plan
    #terraform apply --auto-approve
fi
