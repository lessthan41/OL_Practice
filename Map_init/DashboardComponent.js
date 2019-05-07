class DashboardComponent {
  constructor (data) {
    this.data = data;
    this.map = new MapComponent(this.data);
    // console.log(data);
  }

  init () {
    this.mapInit();
  }

  // Map init
  mapInit () {
    this.map.render();
  }
  mapOnClick () {
    this.map.addMarker();
  }

}
