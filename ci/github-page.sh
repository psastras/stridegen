#!/bin/bash
set -x -e
git clone git@github.com:$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git -b gh-pages public
ls dist
cp -rf dist/* public/
cd public
git config --global user.email "psastras@gmail.com"
git config --global user.name $CIRCLE_PROJECT_USERNAME
git add .
git commit -m "public:ship: $CIRCLE_BUILD_NUM"
git push --force origin gh-pages