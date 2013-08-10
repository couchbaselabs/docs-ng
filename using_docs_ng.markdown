#Intro

Welcome to the new static website for Couchbase TechPubs. To create content, you can author all your information in Markdown. If you need a new guide, contact TechPubs so we can discuss and agree upon any new folders and naming. TechPubs will set up your initial folder as well as add it to site navigation.

##Staging Site and Production Site

- Staging: http://docs.pub.couchbase.com/
- Production: docs.couchbase.com

The Staging server is setup to get and produce content in stage branch of docs-ng. There is a second copy of the repo that will produce and publish the master branch of docs-ng to the public system at S3.

##Source Control

The entire new site as well as new content are in a public GitHub repo you can branch:

- To edit content, branch this repo make your changes to existing files:
    [Github Repo for docs-ng](https://github.com/couchbaselabs/docs-ng)
    
- Then `git checkout stage` to work on the staging server-only content
- To check the branch you are on use `git branch`
- Commit your changes, `git add` and `git commit`
- Push change to staging repo: `git push`
- When you areready, send a pull request so your changes can be merged and published

- Tech Pubs will elevate any content from the stage repo to the master repo, resolving any merge conflicts if needed:

        git checkout stage
        git pull #make sure stage repo up to date
        git checkout master
        git pull #make sure mater repo up to date
        git merge stage #to merge staged changes to master branch
        git push #to push to master
        

##New Guides and New Major Versions

TechPubs will set up your new folder for new guides or new major versions, for example this_guide_name-X.X. TechPubs will also set up the YAML file to include menu options and navigation to your guide. Follow these guidelines once your file is set up:

- Create .markdown files for each chapter in your guide.
- Create an index.erb file at the root of your guide. In this file add an include statement for each .markdown chapter, for instance: 

    <%= include_item 'couchbase-devguide-2.0/couchbase-developer-s-guide-2.0' %>
    
- In your guide folder, keep all your images in a file called images.
    
##Adding and Editing Content

Follow the spec set down by 
[John Gruber for Markdown](http://daringfireball.net/projects/markdown/)      

There are other options supported by Multi-Markdown which we also support, 
most importantly tables. For information on creating tables, see 
[Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#wiki-links)

In general you can use any editor of your choice, with the preference that it includes some automatic spell- and grammar- checking.

After you are done making your changes, make sure you make a pull request so they are picked up in the master repo and published on the staging server.

##Previewing and Publishing Content

To preview your content locally, in the docs-ng repo convert your Markdown to HTML:

nanoc

Then you can preview it:

nanoc view

Open your web browser to  localhost:3000/guide_name/

When you content is ready to stage, commit it and send a pull request to have it added to the master branch in GitHub. This will get picked up by the staging server automatically.




