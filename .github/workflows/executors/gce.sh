#!/usr/bin/env bash

#if: "! contains(toJSON(github.event.commits.*.msg), '[skip-ci]')"
commit_message=$(git log --format=%B -n 1 ${{ github.event.after }})
echo "${commit_message}"

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
echo "${WEBIDS_GCP_SA}" > ${GCLOUD_JSON_KEY_PATH}

terraform_path="${GITHUB_WORKSPACE}/cloud/terraform"
hasBucket=false

gsutil ls gs://${GCLOUD_APP_BUCKET_NAME}
if [[ "$?" -eq "0" ]]; then
    hasBucket=true
else
    gsutil mb -l ${GCLOUD_PROJECT_REGION} -p ${PROJECT_ID} -c standard gs://${GCLOUD_APP_BUCKET_NAME}
    hasBucket=true
fi
if [[ "${hasBucket}" == "true" ]]; then
    cd ${terraform_path}
    terraform init --backend-config="bucket=${GCLOUD_APP_BUCKET_NAME}" --backend-config="prefix=tf-state"
    terraform plan
    terraform destroy --auto-approve
else
    echo "skip terraform step for now!"
fi
