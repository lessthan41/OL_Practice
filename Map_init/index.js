
$(function () {
  var data = 123;
  var dashboard = new DashboardComponent(data);

  // dashboard init
  dashboard.init();

  // map onclick
  $('#map').on('mousedown', function (evt) {
    $('#map').on('mouseup mousemove', function handler(evt) {
      if (evt.type === 'mouseup') {
        dashboard.mapOnClick();
      }
      $('#map').off('mouseup mousemove', handler);
    });
  });
  
});
