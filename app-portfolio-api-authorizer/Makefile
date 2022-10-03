build-AuthorizeRequestFunction:
	npm i
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"src/handlers/authorizeRequest.ts\"] }" > tsconfig-only-handler.json
	npm run build:ts -- --build tsconfig-only-handler.json
	cp -r dist/* "$(ARTIFACTS_DIR)/"

build-RunTimeDependencyLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	rm -rf node_modules
	npm i --production
	cp -r node_modules "$(ARTIFACTS_DIR)/nodejs"

