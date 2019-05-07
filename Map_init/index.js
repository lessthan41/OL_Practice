
$(function () {
  var data = 123;
  var dashboard = new DashboardComponent(data);

  // dashboard init
  dashboard.init();

  // map onclick
  $('#map').click(function (evt) {
    dashboard.mapOnClick();
  });

});
