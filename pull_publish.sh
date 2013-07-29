#!/bin/bash
if [ -e ~/cronenv ]
then
    source ~/cronenv
fi
cd `dirname $0`
BRANCH=`git symbolic-ref --short`
echo "On branch ${BRANCH}, doing git pull"
git pull
echo "Building site..."
bundle exec nanoc
if [ "${BRANCH}" == "master" ]
then
    echo "On master branch, deploying to docs.couchbase.com"
    s3cmd sync -P output/ s3://docs.couchbase.com/
fi
