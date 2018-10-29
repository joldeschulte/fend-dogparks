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
      message: "Failed to fetch from Unsplash =^.^="
    };
  }

  addClick = () => {
    this.setState({clickCounter: this.state.clickCounter + 1});
    if (this.state.clickCounter > 9) {
      this.setState({clickCounter: 0});
    }
  }
  fetchDogPic = () => fetch(`https://api.unsplash.com/search/photos/?page=1&per_page=10&query=dog-park&orientation=landscape&client_id=8023829831c1fb39f95d040b7afc8643af3f4f66401f390da856195b78818556`)
    .then(resp => {return resp.json() })
    .then(data => {
      //console.log(data.results)
      return data.results[this.state.clickCounter].urls.small
    })
    .then(promiseUrl => {
      this.setState({
        dogPic: promiseUrl,
        message: "Fetching dog pic from Unsplash"
      })
      //console.log('promiseUrl')
      //console.log(promiseUrl)
    })
    .catch(
      this.setState({
        dogPic: this.props.venues[0].bestPhoto,
        message: "Failed to fetch from Unsplash =^.^="
      })
    )

  componentDidMount() {
    //console.log('component did mount')
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
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
    this.fetchDogPic();
    this.marker = marker;
    this.addClick();
    // console.log(this.marker.name);
    // Try to fetch the foursqare stuff and store it
  };

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
            return(<Marker
              className="marker"
              key={v.name}
              name={v.name}
              address={v.location.address}
              bestPhoto={v.bestPhoto}
              position={{lat: v.location.lat, lng: v.location.lng }}
              onClick={this.onMarkerClick}
              onKeyPress={this.onMarkerClick}
              tabIndex="0"
              icon={markerIcon}
              />
            )
          })}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
                <div className="park-pic"><img src={this.state.dogPic} alt={this.state.selectedPlace.name+" photo"}/></div>
                <h3>{this.state.selectedPlace.address}</h3>
                <p>{this.state.message}</p>
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
