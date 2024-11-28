TYPEDOC:= ./node_modules/.bin/typedoc
TSC:= ./node_modules/.bin/tsc

# Clean compiled resources and dependencies
clean:
	rm -rf ./.nuxt
	rm -rf ./server
	rm -rf ./node_modules
	rm -f package-lock.json

# Clean GIT tags.
clean-tags:
	git tag | xargs git tag -d
	git fetch -t

# Generate TypeScript docs
docs:
	rm -rf ./docs/assets
	rm -rf ./docs/classes
	rm -rf ./docs/interfaces
	rm -rf ./docs/modules
	$(TYPEDOC) --disableOutputCheck

# Compile and build resources
build:
	$(TSC)

# Docker build.
docker-build:
	docker buildx build --platform linux/arm64 -t strautomator/web .

# Run the app locally
run: build
	-cp -r ../core/settings*.json ./node_modules/strautomator-core/
	-cp -r ../core/lib/. ./node_modules/strautomator-core/lib/
	-cp -r ../../Devv/country-linkify/lib/. ./node_modules/country-linkify/lib/
	-cp    ../../Devv/country-linkify/settings.default.json ./node_modules/country-linkify/
	npm run start:dev

# Update dependencies and set new version
update:
	-rm -rf ./node_modules/strautomator-core
	-ncu -u -x axios,axios-debug-log,chalk,chart.js,floating-vue,nuxt,vue,vue-mention,vuetify-loader,webpack
	-ncu -u --target minor -x vue-mention
	npm version $(shell date '+%y.%-V%u.1%H%M') --force --allow-same-version --no-git-tag-version
	npm install
	-npm audit fix

# Deploy to Google App Engine
deploy-app-engine:
	$(TSC)
	npm run build
	gcloud app deploy app.yaml

# Deploy to GIT (by creating a new tag)
deploy-git:
	npm version $(shell date '+%y.%-V%u.1%H%M') --force --allow-same-version
	git push
	git push --tags

.PHONY: docs
