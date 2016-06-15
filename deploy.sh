#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
BUILD_DIR="build"

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]
then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

# Short hash of HEAD
rev=$(git rev-parse --short HEAD)

# Enter in the builded files directory
cd $BUILD_DIR

# Initialize a new repository then set name and email
git init
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Add and fetch our remote
git remote add upstream "https://$GH_TOKEN@github.com/wendelnascimento/Curso-git.git"
git fetch upstream
git reset upstream/gh-pages

echo "wendelnascimento.github.io/Curso-git/" > CNAME

ls -l

git add -A .
git status
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
