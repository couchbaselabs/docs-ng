var scrollup = _.throttle(function () {
  $('[data-spy="scroll"]').each(function() {
    $(this).scrollspy('refresh');
  });
}, 1000);

$(document).ready(function () {
  $("#sidenav").affix({
    offset: { top: 20 }
  });
  $("#sidenav li").on('activate', function() {
    $(this).addClass('active');
  });
  $("#sidenav li > a").click(function(){
    $(this).parent().addClass("active").siblings().removeClass("active");
  });
  $("table").addClass('table');
});
