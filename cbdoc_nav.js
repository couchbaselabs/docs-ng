var _ = require('underscore');
exports.get = function(basepath, file_extension, options, callback) {
    // See https://github.com/laktek/punch/wiki/Writing-Custom-Helpers
    var block_helpers = {
        active_class: function(ctx) {
            //If the href of this nav item or any of its subnav children is the
            //current page, give it the active class.
            function match(item) { return item.href.indexOf(basepath) === 0; }
            if(match(ctx) || (ctx.subnav && _.some(ctx.subnav, match)))
            {
                return "active";
            }
            return "";
        }
    };
    return callback(null, {block: block_helpers}, {}, new Date());
};
