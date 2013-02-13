var _ = require('underscore');
exports.get = function(basepath, file_extension, options, callback) {
    // See https://github.com/laktek/punch/wiki/Writing-Custom-Helpers
    var block_helpers = {
        active_class: function(ctx) {
            console.log("Active? ", JSON.stringify(ctx));
            //If the href of this nav item or any of its subnav children is the
            //current page, give it the active class.
            function match(item) {
                return item.href.indexOf(basepath) === 0;
            }
            if(match(ctx) || (ctx.subnav && _.some(ctx.subnav, match)))
            {
                return "active";
            }
            return "";
        },
        version_widget: function(ctx) {
            console.log("Ctx: ", JSON.stringify(ctx));
            var versionset = null;
            // if basepath is for example, /foo_bar-12.html, page is "foo_bar"
            var page = basepath.match(/\/([^.\-]+)/)[1];
            function versioned (s) {
                return s.match(/\/([^.]+)/)[1];
            }
            _.each(ctx.versions, function(set, key) {
                if(page === key) {
                    versionset = set;
                }
            });
            console.log("Version set:", versionset);
            if(versionset) {
                var html = '<div class="pull-right versions">' +
                           '<ul class="nav nav-pills">'+
                           '<li><span class="versiontext">Versions: </span></li>';
                _.each(versionset, function(link) {
                    html += '<li';
                    if(versioned(link[1]) == versioned(basepath)) { html += ' class="active"'; }
                    html += '><a href="' + link[1] + '">' + link[0] + '</a></li>';
                });
                html += '</ul></div>';
                return html;
            }
            return "";

        }
    };
    return callback(null, {block: block_helpers}, {}, new Date());
};
