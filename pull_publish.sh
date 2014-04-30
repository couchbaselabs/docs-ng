#!/bin/bash
if [ -e ~/cronenv ]
then
    source ~/cronenv
fi
echo "Building docs at $(date)"
cd `dirname $0`
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo "On branch ${branch}, doing git pull"
git pull
echo "Building site..."
bundle exec nanoc
if [ "${branch}" == "master" ]
then
    echo "On master branch, deploying to docs.couchbase.com"
    s3cmd sync -P output/ s3://docs.couchbase.com/
fi
echo "Done at $(date)"
