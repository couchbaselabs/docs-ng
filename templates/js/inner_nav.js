var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
  });
}

function dasherize(string) {
  var dashify = new RegExp( '[\\ _]+', 'g' );
  var kill = new RegExp( '[^A-Za-z0-9\\-_]+', 'g' );
  return string.toLowerCase().replace(dashify, '-').replace(kill, '');
}

var scrollup = _.throttle(function () {
  $('[data-spy="scroll"]').each(function() {
    $(this).scrollspy('refresh');
  });
}, 1000);

function setupSideNav() {
  var level = 1;
  var html = '';
  var ids = {};
  var first = true;
  $(".mdcontent > h1, h2").each(function(i, el) {
    var tag = $(el).prop('tagName');
    var taglevel = parseInt(tag.charAt(1), 10);
    var text = $(el).text();

    var dashed = dasherize(text);
    var id = dashed;
    var incr = 2;
    while(ids[id]) {
      id = dashed + "_" + incr;
    }
    ids[id] = true;

    $(el).attr('id', id);
    $(el).addClass('jumptarget');

    if(taglevel > level) {
      html += '<ul class="sub-menu">';
      html += '<li><a href="#' + id + '">' + escapeHtml(text) + '</a>';
    } else if (taglevel < level) {
      html += '</li></ul></li>';
      html += '<li><a href="#' + id + '">' + escapeHtml(text) + '</a>';
    } else {
      if(!first) {
        html += '</li>';
      }
      html += '<li><a href="#' + id + '">' + escapeHtml(text) + '</a>';
    }
    level = taglevel;
    first = false;
  });
  $("#sidenav").append(html);
  $("#sidenav").affix({
    offset: { top: 20 }
  });
  $("#sidenav li").on('activate', function() {
    $(this).addClass('active');
  });

  $("#sidenav > li > a").click(function(){
    $(this).parent().addClass("active").siblings().removeClass("active");
  });
  //$("img").load(scrollup);
  //scrollup();
}

$(document).ready(function () {
  setupSideNav();
  $("table").addClass('table');
});
