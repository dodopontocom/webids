#!/bin/bash

if [[ $(gcloud services list --enabled | grep iam.googleapis.com) ]]
then
    echo "iam api is enabled"
    else
        gcloud services enable iam.googleapis.com
fi

if [[ $(gcloud services list --enabled | grep compute.googleapis.com) ]]
then
    echo "compute engine api is enabled"
    else
        gcloud services enable compute.googleapis.com
fi

gcloud iam service-accounts list
