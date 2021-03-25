#!/bin/bash
#

# APPLICATION INFO
export APP_NAME="webids"

export GCLOUD_APP_BUCKET_CLASS="standard"
export GCLOUD_STORAGE_BASE_URL="https://storage.cloud.google.com"
export GCLOUD_APP_BUCKET_NAME="web-construtora-cp-bucket"

# GCLOUD ENV VARS
export GCLOUD_PROJECT_ID="webids"
# export GCLOUD_APP_BUCKET_NAME="${GCLOUD_PROJECT_ID}.appspot.com"
export GCLOUD_JSON_KEY_PATH="${GITHUB_WORKSPACE}/cloud/credentials/credential.json"
export REF_IMOVEL_PREFIX="ref20"

export GCLOUD_TF_BUCKET_NAME="tf-bkend"
export GCLOUD_PROJECT_REGION="us-central1"

export DOCKER_REGISTRY_SECRET_NAME="gcr-secret"
export GCLOUD_SA_NAME="devops-sa"
export GCLOUD_SA_EMAIL="${GCLOUD_SA_NAME}@${GCLOUD_PROJECT_ID}.iam.gserviceaccount.com"
export GCLOUD_CONTAINER_REGISTRY_BUCKET="us.artifacts.${GCLOUD_PROJECT_ID}.appspot.com"
export GCLOUD_CONTAINER_IMAGE="us.gcr.io/${GCLOUD_PROJECT_ID}/${APP_NAME}"
export GCLOUD_GAE_SA_EMAIL="${GCLOUD_PROJECT_ID}@appspot.gserviceaccount.com"

# Terraform variables
export TF_VAR_tf_backend_bucket_name="${GCLOUD_TF_BUCKET_NAME}"
export TF_VAR_project_id="${GCLOUD_PROJECT_ID}"
export TF_VAR_machine_type="n1-standard-4"
export TF_VAR_region="${GCLOUD_PROJECT_REGION}"
export TF_VAR_zone="${GCLOUD_PROJECT_REGION}-a"
export TF_VAR_cluster_name="gke-cluster-1"
export TF_VAR_cluster_count="3"
export TF_VAR_key="${GCLOUD_JSON_KEY_PATH}"
export TF_VAR_vpc_name="${GCLOUD_PROJECT_ID}-vpc"

export TF_VAR_compute_instance_environment="dev"
export TF_VAR_ubuntu_image="ubuntu-os-cloud/ubuntu-1804-lts"
export TF_VAR_startup_script="${GITHUB_WORKSPACE}/cloud/scripts/${STARTUP_SCRIPT}"
export TF_VAR_ssd_name="data-ssd"

export TF_VAR_MONGO_ATLAS_STRING="${MONGO_ATLAS_STRING}"
export TF_VAR_JWT_KEY="${JWT_KEY}"

export GOOGLE_APPLICATION_CREDENTIALS=${TF_VAR_key}

# Circle ci references
export CIRCLE_COMMIT_APPLY="tf-apply"
export CIRCLE_COMMIT_TF_DRY_RUN="tf-plan"
export CIRCLE_COMMIT_DESTROY="tf-destroy"
export CIRCLE_COMMIT_SKIP_DOCKER="skip-docker"
export CIRCLE_COMMIT_GAE="appengine"
