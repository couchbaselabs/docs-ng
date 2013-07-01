About
=====

This is a project to build a static documentation website for
Couchbase.

Showstoppers/Blockers
======================
- Something better than Google Custom search or alternate page separatation/anchors, especially for jump-links. (Marty - investigating)

General Requirements/Features
================
- Breadcrumb navigation - phase 2
- Add corporate website headers, footers, etc to docs initial landing page (Karen)
- Improve left navigation. Items at end disappear when multiple sub-menus are open. (Volker - DONE)
- Short-term mobile hack -toggle open and close of left navigation to support mobile. (Volker)
- Longer term mobile layout.
- Input/improvements popout hooked up to CBugg (Dustin)
- Parser/conversions from SDK comments to Markdown (Sergey Ruby and C)
- Anything else you can think of to make this a great user and authoring experience.
- Make repo public, or at minimum add support as contributors.
- Provide longer pages with jump links to subsections

How to Contribute Code
======================

1. Fork it and clone (`git clone git@github.com:USERNAME/punch_stuff.git`)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

How to Run Locally
==================

Make sure you have Bundler,

    gem install bundler

Install the dependencies,

    bundle install

And run the generator and server with Foreman

    foreman start

The site will be available at <http://localhost:3000/>

Resources
======================

Internal Staging site at docs.pub.couchbase.com 
External Site

How to Contribute Content
=========================

TODO: new contributing guidelines



How to Convert on Docs Staging
==================

1) Manually:

cd /home/docs/docs-ng
./pull_publish.sh

2) Automatically

The ./pull_publish.sh is running automatically as a cron job every 60 minutes and will pull from git, convert with nanoc.

