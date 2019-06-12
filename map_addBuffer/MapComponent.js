class MapComponent {
  constructor (data) {
    this.data = data;
    this.coorContainer = new Array();
    this.mousePositionControl = null;
    this.map = null;
    this.bufferLayer = new ol.layer.Vector({});
    this.bufferRadius = 100 * 1000; // default 50 km
    this.pointStyle = [
      new ol.style.Style({
          image: new ol.style.Icon(({
              scale: 0.3,
              rotateWithView: false,
              anchor: [0.5, 0.9],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              opacity: 1,
              src: 'https://lessthan41.github.io/TyphoonSearch/img/pointer1.png'
          }))
      })
    ];
    this.bufferStyle = [
      new ol.style.Style({
          stroke: new ol.style.Stroke({
              color: '#595959',
              width: 1
          }),
          fill: new ol.style.Fill({
              color: 'rgba(61, 60, 60, 0.3)'
          })
      })
    ];
  }

  render () {
    this.init();
  }

  init () {
    this.mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });
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
          this.bufferLayer, // Empty Layer for addBuffer
          new ol.layer.Vector({})  // Empty Layer for addMarker
        ],
        view: new ol.View({ // setView
          center: ol.proj.fromLonLat([126.5, 22.5]),
          zoom: 6
        })
      });
      // Onclick add Marker
      this.map.on('click', (evt) => { // due to callback problem need arrow function
        if (evt.dragging) {
          return;
        }
        this.addMarker();
      });
  }

  // Add pointer
  addMarker () {
    setTimeout( () => { // set time out for smartphone version (no instant mousePosition)
      this.coorContainer.push( this.getMousePosition() );
      this.addPoint(this.coorContainer);
      this.addBuffer(this.coorContainer);
    }, 10);
  }


  // Clear Pointer and Line
  removeMarker () {
    this.coorContainer = [];
    this.addPoint(this.coorContainer);
    this.addBuffer(this.coorContainer);
  }

  /* Get Coordinate and Return [x, y] */
  getMousePosition () {
    let currentPosition = $('#mouse-position').text();
    let commaPosition = currentPosition.indexOf(',');
    let x = parseFloat(currentPosition.substring(0, commaPosition));
    let y = parseFloat(currentPosition.substring(commaPosition+1));
    return ol.proj.fromLonLat([x, y]);
  }

  // Relocate marker
  addPoint (coor) {
    let feature = coor.slice();
    let coorCount = 0;
    for(var i=0; i<feature.length; i++) { // for i in coorCintainer add Feature and set style
      feature[i] = new ol.Feature(new ol.geom.Point(this.coorContainer[coorCount]));
      feature[i].setStyle(this.pointStyle);
      coorCount++;
    }
    let source = new ol.source.Vector ({ features: feature });
    let pointLayer = new ol.layer.Vector ({ source: source });
    this.map.getLayers().getArray().splice(2,1,pointLayer); // replace the previous one
    this.map.render();
  }

  /* Add Buffer */
  addBuffer (coor) {
    let coorLength = coor.length;
    let center = coor.slice();
    let bufferArray = new Array();
    let sourceBuffer;
    let style = this.bufferStyle;
    let radius

    for(var i=0; i<coorLength; i++){
      radius = this.radiusCorrection(center[i], this.bufferRadius); // Radius Correction
      bufferArray[i] = new ol.Feature({ geometry: new ol.geom.Circle(center[i], radius) });
      bufferArray[i].setStyle(style);
    }

    sourceBuffer = new ol.source.Vector({ features: bufferArray });
    this.bufferLayer = new ol.layer.Vector({ source: sourceBuffer });
    this.map.getLayers().getArray().splice(1,1,this.bufferLayer); // replace the previous one
    this.map.render();
  }

  /* Convert Radius Wanted(m) into value to input */
  radiusCorrection (center, radius) {
    let edgeCoordinate = [center[0] + radius, center[1]];
    let wgs84Sphere = new ol.Sphere(6378137);
    let groundRadius = wgs84Sphere.haversineDistance(
        ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
        ol.proj.transform(edgeCoordinate, 'EPSG:3857', 'EPSG:4326')
    );

    return radius/groundRadius * radius; // Ratio * radius
  }
}
