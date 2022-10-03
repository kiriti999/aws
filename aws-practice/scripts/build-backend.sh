#!/usr/bin/env bash
set -eo pipefail

# source ./scripts/nvm_setup.sh

cd backend

# nvm install
rm -rf package-lock.json
npm install
