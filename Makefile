all: build

build: 
	npm run build

run:
	cat ./jest.config.ts
	npm run main

test:
	npm run test

eslint:
	npm run eslint

parcel:
	npm run parcel

clean:
	rm -f *~
