#!/bin/bash

# check whether file ~/cronenv exists and if it does, read the file and execute the commands in it
if [ -e ~/cronenv ]
then
    source ~/cronenv
fi

echo "Building docs at $(date)"

# extract directory name from the filename of the current script and cd to it
cd `dirname $0`

# retrieve names of git branches and pick out the one that is starred (current branch)
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo "On branch ${branch}, doing git pull"

# retrieve the latest files from the current git branch
git pull

# build the docs website
echo "Building site..."
bundle exec nanoc

#BIG UGLY HACK courtesy AMY 20140722 & updated 20140724
cp -r output/prebuilt/couchbase-manual-3.0/assets-dita output/

# Hack for S3 redirects related to new Docs
mv output/index.html output/index_old.html

# if on master branch, publish output files to S3
if [ "${branch}" == "master" ]
then
    echo "On master branch, deploying to docs.couchbase.com"
    s3cmd sync -P output/ s3://docs.couchbase.com/
fi

echo "Done at $(date)"
