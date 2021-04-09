#!/usr/bin/env bash
#
#gcp.auth.useSA ${GOOGLE_APPLICATION_CREDENTIALS}

source ${GITHUB_WORKSPACE}/.github/workflows/cicd-definitions.sh
echo "${WEBIDS_GCP_SA}" > ${GCLOUD_JSON_KEY_PATH}

APP_PATH="${GITHUB_WORKSPACE}/${PROJECT_ID}/${PROJECT_ID}-a"

echo ${WEBIDS_GCP_SA} > ${APP_PATH}/backend/keyfile.json

#GAE_DEPLOYMENT_VERSION=""
#if [[ "${CIRCLE_BRANCH}" == "develop" ]]; then
#    GAE_DEPLOYMENT_VERSION="${CIRCLE_BRANCH}-build-${CIRCLE_BUILD_NUM}"
#fi
#if [[ -z ${GAE_DEPLOYMENT_VERSION} ]] && [[ "${CIRCLE_BRANCH}" != "master" ]]; then
#    GAE_DEPLOYMENT_VERSION="$(echo ${CIRCLE_BRANCH//\//-}-build-${CIRCLE_BUILD_NUM} | tr '[:upper:]' '[:lower:]')"
#fi
#if [[ -z ${GAE_DEPLOYMENT_VERSION} ]] && [[ "${CIRCLE_BRANCH}" == "master" ]]; then
#    GAE_DEPLOYMENT_VERSION="prod-${CIRCLE_BUILD_NUM}"
#fi

#sed -i 's#GAE_DEPLOYMENT_VERSION#'${GAE_DEPLOYMENT_VERSION}# "${APP_PATH}/src/app/version/version.component.html"

cd ${APP_PATH}
echo n | npm install
npm run build -- --configuration production
        
echo "MONGO_ATLAS_STRING=\"${MONGO_ATLAS_STRING}\"" > ${APP_PATH}/backend/.env
echo "JWT_USER_PASS_LONG_SECRET=\"${JWT_USER_PASS_LONG_SECRET}\"" >> ${APP_PATH}/backend/.env
#echo "GCLOUD_STORAGE_BASE_URL=\"${GCLOUD_STORAGE_BASE_URL}\"" >> ${APP_PATH}/backend/.env
#echo "REF_IMOVEL_PREFIX=\"${REF_IMOVEL_PREFIX}\"" >> ${APP_PATH}/backend/.env
#echo "GCS_BUCKET=\"${GCLOUD_APP_BUCKET_NAME}\"" >> ${APP_PATH}/backend/.env
#echo "GCLOUD_PROJECT=\"${GCLOUD_PROJECT_ID}\"" >> ${APP_PATH}/backend/.env
#echo "GCS_KEYFILE=\"./keyfile.json\"" >> ${APP_PATH}/backend/.env

#gcp.useProject "${GCLOUD_PROJECT_ID}"
gcloud config set gcloudignore/enabled false
cd ${APP_PATH}/backend
gcloud app deploy "app.yaml" v1

#gcp.auth.revokeSA "${GOOGLE_APPLICATION_CREDENTIALS}"
#gcloud auth revoke "${GCLOUD_SA_EMAIL}"
#rm -vfr "${GOOGLE_APPLICATION_CREDENTIALS}"

#message=$(gcloud app browse --no-launch-browser -s backend -v ${GAE_DEPLOYMENT_VERSION})
