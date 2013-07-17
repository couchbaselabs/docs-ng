#!/bin/sh

cd /home/docs/docs-ng
git pull
bundle exec nanoc
s3cmd sync -P output/ s3://docs-couchbase
