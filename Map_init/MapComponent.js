class MapComponent {
  constructor (data) {
    this.data = data;
    this.map = null;
    // this.pointLayer = new ol.layer.Vector({});
    this.mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });
  }

  render () {
    this.init();
  }

  init () {
    this.map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({ // MousePosition
          attributionOptions: {
            collapsible: false
          }
        }).extend([this.mousePositionControl]),
        layers: [ // OSM
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          new ol.layer.Vector({}) // For addMarker
        ],
        view: new ol.View({ // setView
          center: ol.proj.fromLonLat([126.5, 22.5]),
          zoom: 6
        })
      });
  }

  addMarker () {
    // console.log(this.getMousePosition());
    let coordinate = this.getMousePosition();
    let feature = new Array(1);
    feature[0] = new ol.Feature(new ol.geom.Point(coordinate));
    let source = new ol.source.Vector({ features: feature });
    let pointLayer = new ol.layer.Vector({ source: source });
    console.log(feature);
    this.map.getLayers().getArray()[1] = pointLayer;
  }

  // Get Coordinate and Return
  getMousePosition () {
    let currentPosition = $('#mouse-position').text();
    let lng = parseFloat(currentPosition.substring(0, 8));
    let lat = parseFloat(currentPosition.substring(10));
    // console.log(currentPosition);
    // console.log(currentPosition.substring(0, 8)); // longitude
    // console.log(currentPosition.substring(10)); // latitude
    return (ol.proj.fromLonLat([lng, lat]));
  }
}
