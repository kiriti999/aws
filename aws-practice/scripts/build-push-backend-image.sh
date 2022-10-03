#!/bin/bash

set -eo pipefail

# source ./scripts/nvm_setup.sh

printUsage() {
    echo -e ""
    echo -e "Usage: $0 build-number\n"
    echo -e "build-number: The build number to deploy."
}
[ -z "$1" ] && echo "Error: Missing build-number parameter" && printUsage && exit 1

BUILD_NUMBER=$1
ENV=$2
REGISTRY="327303463717.dkr.ecr.us-east-2.amazonaws.com/aws-practice-node"
TAG="aws-practice-node-${BUILD_NUMBER}"
REPOSITORY="aws-practice-node"
REGION="us-east-2"

# Get ECR registry login
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.${REGION}.amazonaws.com"

# Build the Docker image
(
    cd backend
    docker build -t ${REPOSITORY} .
    docker tag "${REPOSITORY}:latest" "${REGISTRY}:${TAG}"
)

echo "built ${REGISTRY}:${TAG}"

# Push to registry
echo "Pushing new application Docker image to AWS ECR"
docker push ${REGISTRY}:${TAG}

(
    MY_MANIFEST=$(aws ecr batch-get-image --repository-name ${REPOSITORY} --image-ids imageTag=${TAG} --query images[].imageManifest --region us-east-2 --output text)
    aws ecr put-image --repository-name ${REPOSITORY} --image-tag ${ENV}_${BUILD_NUMBER} --image-manifest "$MY_MANIFEST" --region us-east-2
)

# Delete the local image (both the original one and the tagged one)
docker rmi ${REGISTRY}:${TAG}
docker rmi ${REPOSITORY}
