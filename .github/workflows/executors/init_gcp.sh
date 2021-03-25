#!/bin/bash

if [[ $(gcloud services list --enabled | grep iam.googleapis.com) ]]
then
    echo "iam api is enabled"
    else
        gcloud services enable iam.googleapis.com
fi

gcloud iam service-accounts list
