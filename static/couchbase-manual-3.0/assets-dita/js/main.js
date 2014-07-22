$(document).ready(function() {
  /*
  Automatically perform code highlighting everywhere.
  */
  $('.codeblock').each(function(i, e) {hljs.highlightBlock(e)});

  /*
  The following code converts ul/li groups that have the .tabs class
  into a bootstrap tabs pane instead of a normal list.
  */
  var tabstotal = 0;
  $('.tabs').each(function(i, e) {
    var pages = $('<div class="tab-content"></div>');
    $(e).after(pages);

    $(e).addClass('nav nav-tabs');

    $(e).find('li').each(function(ii, ie) {
      var title = $(ie).children('.wintitle');
      var titlehtml = title.html();
      title.hide();

      var tabid = 'gentab-' + (++tabstotal);

      var pane = $('<div class="tab-pane" id="' + tabid + '"></div>');
      pane.append($(ie).contents());
      pages.append(pane);

      var tablink = $('<a href="#' + tabid + '" data-toggle="tab"></a>');
      tablink.append(titlehtml);
      $(ie).append(tablink);

      tablink.click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      });
    });
    $(e).find('a:first').tab('show');
  });
});
