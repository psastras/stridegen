# Stridegen

[![CircleCI](https://img.shields.io/circleci/project/psastras/stridegen/master.svg?maxAge=2592000)](https://circleci.com/gh/psastras/stridegen)
[![npm version](https://badge.fury.io/js/stridegen.svg)](https://badge.fury.io/js/stridegen)

Stridegen is a Swagger documentation generator.  Similar to the [https://github.com/swagger-api/swagger-ui](swagger-ui) project,
Stridegen will, given an input Swagger 2.x definition output a static web page.

Stridegen is written in [React](https://facebook.github.io/react/) + [Sass](http://sass-lang.com/), and uses Webpack to build and output HTML.

## Installation

Currently, Stridegen will only run on OSX / Linux environments.  It can be run on Windows machines as well, however at this time
the project must be installed manually - see the Development section.

To install or update Stridegen, grab it from the npm repository,
```
npm install -g stridegen
``` 
Then, to generate documentation, run `stridegen` and give it an input Swagger definition and output directory.

```
stridegen -f <swagger_definition>.json -o <output_dir>
```
Open up `<output_dir>/index.html` in the browser of your choice.

[Click here](https://github.com/psastras/stridegen/blob/master/src/watson.json) to download a sample Swagger definition file.

## Development

To develop Stridegen, or manually build documentation if using Windows first clone and install dependencies.

```
git clone https://github.com/psastras/stridegen.git
cd stridegen
npm install
```

To start the development server (which will automatically hot reload changes) run

```
npm run start
```

And then navigate to [http://localhost:3000/](http://localhost:3000/).

To run tests, 

```
npm run test
```

To build documentation / distribution pages (ie. if on Windows),

```
npm run build
```

# License

MIT license. Copyright © 2016, Paul Sastrasinh. All rights reserved.
