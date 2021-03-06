# opentrons protocol designer makefile

# using bash instead of /bin/bash in SHELL prevents macOS optimizing away our PATH update
SHELL := bash

# add node_modules/.bin to PATH
PATH := $(shell cd .. && yarn bin):$(PATH)

benchmark_output := $(shell node -e 'console.log(new Date());')

# standard targets
#####################################################################

.PHONY: all
all: clean build

.PHONY: setup
setup:
	yarn

.PHONY: clean
clean:
	shx rm -rf dist

# artifacts
#####################################################################

.PHONY: build
build: export NODE_ENV := production
build:
	webpack --profile
	git rev-parse HEAD > dist/.commit

# development
#####################################################################

.PHONY: benchmarks
benchmarks: export NODE_ENV := test
benchmarks:
	shx mkdir -p benchmarks/output
	node ../scripts/runBenchmarks "./benchmarks/*.js" | \
	ntee "./benchmarks/output/$(benchmark_output)"

.PHONY: dev
dev: export NODE_ENV := development
dev:
	webpack-dev-server --hot

# production assets server
.PHONY: serve
serve: all
	node ../scripts/serve-static dist

# end to end tests
.PHONY: test-e2e
test-e2e:
	concurrently --no-color --kill-others --success first --names "protocol-designer-server,protocol-designer-tests" \
	"$(MAKE) dev CYPRESS=1" \
	"wait-on http://localhost:8080/ && cypress run --browser chrome --headless --record false"
