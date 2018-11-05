import React, { Component } from 'react';
import MapContainer from './MapContainer'
import {venues} from '../consts/dogparks'

class SearchableMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: venues,
      searchButtonClass: "button closed-search",
      searchButtonText: "Search Parks",
      searchListClass: "search",
      query: "",
      selectedAddress: "",
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false,
      dogPic: {},
      clickCounter: 0,
      message: "Failed to fetch from Unsplash =^.^=",
      allMarkers: [],
      fakeWindowClass: "bottom hide"
    };
  }

  addMarker = (m) => {
    this.setState({
      allMarkers: this.state.allMarkers + m
    })
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
      return data.results[~~(Math.random() * 10)].urls.small
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
        dogPic: this.state.venues[0].bestPhoto,
        message: "Failed to fetch from Unsplash =^.^="
      })
    )

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
    // console.log('on marker click:');
    // console.log(props);
    // console.log(marker);
    // console.log(e);
    this.fetchDogPic();
    this.marker = marker;
    this.addClick();
    if (this.state.fakeWindowClass === "bottom") {
      this.setState({
        fakeWindowClass: "bottom hide"
      })
    }
  }

  searchClick = () => {
    if (this.state.searchButtonClass === "button open-search") {
      this.setState({
        searchButtonClass: "button closed-search",
        searchButtonText: "Search Parks",
        searchListClass: "search"
      })
      //console.log('search click')
    } else {
      this.setState({
        searchButtonClass: "button open-search",
        searchButtonText: "X",
        searchListClass: "search show",
        query: "",
        selectedAddress: "",
        selectedPlace: {},
        activeMarker: {},
        showingInfoWindow: false,
        venues: venues
      })
    }
    if (this.state.fakeWindowClass === "bottom") {
      this.setState({
        fakeWindowClass: "bottom hide"
      })
    }
  }

  filterVenues = (q, address) => {
    let filtered_venues = venues.filter(v => v.name.toLowerCase().includes(q.toLowerCase()));
    this.setState({
      venues: filtered_venues
    })
    if (filtered_venues.length === 1) {
      this.setState({
        selectedAddress: address
      })
    } else {
      this.setState({
        selectedAddress: ""
      })
    }
  }
  markerSearch = (e) => {
    this.setState({
      query: e.target.value
    })
    this.filterVenues(e.target.value)
  }
  parkClick = (name, address) => {
    //console.log(name)
    this.filterVenues(name, address)
    //console.log(venues[0])
    this.searchClick();
    this.fetchDogPic();
    this.setState({
      query: name,
      fakeWindowClass: "bottom"
    })
  }

  render() {
    return (
      <div className="SearchableMap">
        <div
          className={this.state.searchButtonClass}
          role='button'
          tabIndex="0"
          onClick={this.searchClick}
          onKeyPress={this.searchClick}
          >
            {this.state.searchButtonText}
        </div>
        <div
          className={this.state.searchListClass}
        >
          <input
            onChange={ this.markerSearch }
            className='search-input'
            type='text'
            role='form'
            aria-labelledby='search'
            tabIndex="0"
            placeholder='Search Dog Parks'
            value={ this.state.query }
          />
          <ul className='search-list'>
            {this.state.venues.map( v =>
              <li
                key={v.name}
                onClick={() => this.parkClick(v.name, v.location.address)}
                onKeyPress={() => this.parkClick(v.name, v.location.address)}
                id={v.name}
                tabIndex={"0"}
                aria-describedby={"Select " + v.name}
              >{v.name}</li>
              )
            }
          </ul>
        </div>
        <div className={this.state.fakeWindowClass}>
        <h1>{(this.state.venues.length > 0) ? this.state.venues[0].name : null}</h1>
        <div className="small-park-pic"><img src={this.state.dogPic} alt={(this.state.venues.length > 0) ? this.state.venues[0].name+" photo" : "no park image"}/></div>
        <h3>{(this.state.venues.length > 0) ? this.state.venues[0].location.address : null}</h3>
        <p>{this.state.message}</p>
        </div>
        <MapContainer
          venues={this.state.venues}
          onMarkerClick={this.onMarkerClick}
          selectedPlace={this.state.selectedPlace}
          activeMarker={this.state.activeMarker}
          showingInfoWindow={this.state.showingInfoWindow}
          dogPic={this.state.dogPic}
          clickCounter={this.state.clickCounter}
          message={this.state.message}
          addMarker={this.addMarker}
        />
      </div>
    );
  }
}

export default SearchableMap;
