import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import {mapStyles} from '../consts/mapStyles';
import markerIcon from '../images/wht-blank.png';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false,
      dogPic: {},
      clickCounter: 0,
      message: "Failed to fetch from Unsplash =^.^=",
      readyMap: 0
    };
  }

  componentDidMount() {
    //console.log(this.props.google.maps)
  }

  myBounds = () => {
    let bounds = new this.props.google.maps.LatLngBounds();
    for (let i=0; i < this.props.venues.length; i++) {
      const location = this.props.venues[i].location
      bounds.extend({ lat: location.lat, lng:location.lng})
    }
    return bounds
  }

  onMapReady = (mapProps, map) => {
    this.map = map;
    // console.log(this.map);
    map.fitBounds(this.myBounds());
    this.setState({readyMap: true});
    // console.log('ready')
  };

  alertError = () => {
    alert('Google Maps Error')
  }

  render() {

    let bounds = this.myBounds()
    // console.log(bounds)
    return (
      <div className='map-container'>
        <Map
          className="map"
          styles={mapStyles}
          google={this.props.google}
          initialCenter={{
              lat: 30.3072,
              lng: -97.7431
            }}
          zoom={12}
          maxZoom={15}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          bounds={bounds}
          onReady={this.onMapReady}>
          {this.props.venues.map( v => {
            let animate = this.props.google.maps.Animation.NONE
            if (v.name === this.props.selectedPlace.name || this.props.venues.length === 1) {
              animate = this.props.google.maps.Animation.DROP
            }
            //console.log(v.name);
            //console.log(this.props.selectedPlace.name);
            return(<Marker
              className="marker"
              key={v.name}
              name={v.name}
              address={v.location.address}
              bestPhoto={v.bestPhoto}
              position={{lat: v.location.lat, lng: v.location.lng }}
              onClick={this.props.onMarkerClick}
              onKeyPress={this.props.onMarkerClick}
              tabIndex="0"
              icon={markerIcon}
              animation={animate}
              />
            )
          })}
          <InfoWindow
            marker={this.props.activeMarker}
            visible={this.props.showingInfoWindow}>
              <div>
                <h1>{this.props.activeMarker.name}</h1>
                <div className="park-pic"><img src={this.props.dogPic} alt={this.props.selectedPlace.name+" photo"}/></div>
                <h3>{this.props.selectedPlace.address}</h3>
                <p>{this.props.message}</p>
              </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyANFdpzxzykaDfaxvT51sHi-rn23A8WWPc')
})(MapContainer)
