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

function setupSideNav() {
  var level = 1;
  var html = '';
  $(".mdcontent > h1, h2").each(function(i, el) {
    var tag = $(el).prop('tagName');
    var taglevel = parseInt(tag.charAt(1), 10);
    var text = $(el).text();
    var id = dasherize(text);
    html += '<li><a href="#' + id + '">' + escapeHtml(text) + '</a>';
    $(el).attr('id', id);
    if(taglevel > level) {
      html += '<ul class="sub-menu">';
    } else if (taglevel < level) {
      html += '</li></ul></li>';
    } else {
      html += '</li>';
    }
    level = taglevel;
  });
  $("#sidenav").append(html);
  $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh');
  });
  $("#sidenav").affix({
    offset: { top: 60 }
  });
  $("#sidenav li").on('activate', function() {
    $(this).addClass('active');
  });
}

$(document).ready(function () {
  setupSideNav();
  $("table").addClass('table');
});
