#!/usr/bin/env bash
set -e

# source ./scripts/nvm_setup.sh

printUsage() {
    echo -e ""
    echo -e "Usage: $0 environment build-number\n"
    echo -e "environment: The environment to provision for (e.g. dev, uat, prod etc.)"
    echo -e "build-number: The build number to deploy."
    echo -e "vpc-environment: The VPC environment to deploy into."
    echo -e "amiId: The latest AMI ID for containers."
    echo -e "SkipRetainedResources $5: Check if the retained resources needs to be re-created"
}

[ -z "$1" ] && echo "Error: Missing env parameter" && printUsage && exit 1
[ -z "$2" ] && echo "Error: Missing build-number parameter" && printUsage && exit 1
[ -z "$3" ] && echo "Error: Missing VPC env parameter" && printUsage && exit 1
[ -z "$4" ] && echo "Error: Missing amiId parameter" && printUsage && exit 1
[ -z "$5" ] && echo "Error: Missing create retained resources parameter" && printUsage && exit 1

ENV=$1
BUILD_NUMBER=$2
VPC_ENV=$3
AMI_ID=$4
CREATE_RETAINED_RESOURCES=$5
REGION="eu-west-1"

echo "The latest AMI ID is: '$AMI_ID'"
echo "The Skip resource value is: '$CREATE_RETAINED_RESOURCES'"

if [ "$ENV" = prod ]; then
    REGISTRY="327303463717.dkr.ecr.us-east-2.amazonaws.com/aws-practice-node"
else
    REGISTRY="327303463717.dkr.ecr.us-east-2.amazonaws.com/aws-practice-node"
fi

TAG="aws-practice-node-${BUILD_NUMBER}"
IMAGE_NAME="${REGISTRY}:${TAG}"

echo "Updating/creating backend stack for environment '$ENV' using '${IMAGE_NAME}'"
ansible-playbook -c local \
    -e ansible_python_interpreter=$(which python) \
    -i localhost, \
    -e env="'${ENV}'" \
    -e backendContainerImage="'${IMAGE_NAME}'" \
    -e vpcEnv="'${VPC_ENV}'" \
    -e version="'${BUILD_NUMBER}'" \
    -e amiId="'${AMI_ID}'" \
    -e skipRetainedResources="'${CREATE_RETAINED_RESOURCES}'" \
    infrastructure/backend.ansible.yaml
