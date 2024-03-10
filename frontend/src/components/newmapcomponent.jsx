import React, { Component } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';   

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: []
    };
    this.featureGroupRef = React.createRef();
  }

  _onFeatureGroupReady = (reactFGref) => {
    this.reactFGref = reactFGref;
  }

  _onEdited = (e) => {
    console.log('Edited feature:', e.layers);
  }

  _onCreated = (e) => {
    const { layers } = this.state;
    layers.push(e.layer);
    this.setState({ layers });
  }

  _onDeleted = (e) => {
    console.log('Deleted feature:', e.layers);
  }

  _onMounted = (drawControl) => {
    this.drawControl = drawControl;
  }

  _onEditStart = () => {
    console.log('Edit started');
  }

  _onEditStop = () => {
    console.log('Edit stopped');
  }

  _onDeleteStart = () => {
    console.log('Delete started');
  }

  _onDeleteStop = () => {
    console.log('Delete stopped');
  }
  componentDidMount() {
    const marker = this.featureGroupRef.current.leafletElement.getLayers().find(layer => layer instanceof L.Marker);
    const polygon = this.featureGroupRef.current.leafletElement.getLayers().find(layer => layer instanceof L.Polygon);
    const circle = this.featureGroupRef.current.leafletElement.getLayers().find(layer => layer instanceof L.Circle);

    console.log('Marker coordinates:', marker.getLatLng());
    console.log('Polygon coordinates:', polygon.getLatLngs().map(latlng => [latlng.lat, latlng.lng]));
    console.log('Circle coordinates:', circle.getLatLng());
  }

  render() {
    const { layers } = this.state;
    return (
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: "40vh",
          width: "100%",
          marginTop: "20px",
          zIndex: 0,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={this.featureGroupRef}>
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              polyline: true,
              polygon: true,
              marker: false,
              circle: false
            }}
          />
        </FeatureGroup>
      </MapContainer>
    );
  }
}

export default MyMap;