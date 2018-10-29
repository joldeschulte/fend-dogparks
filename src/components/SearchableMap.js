import React, { Component } from 'react';
import MapContainer from './MapContainer'
import {venues} from '../consts/dogparks'

class SearchableApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: venues,
      searchButtonClass: "button closed-search",
      searchButtonText: "Search Parks",
      searchListClass: "search",
      query: "",
      selectedAddress: ""
    };
  }
  searchClick = () => {
    if (this.state.searchButtonClass === "button open-search") {
      this.setState({
        searchButtonClass: "button closed-search",
        searchButtonText: "Search Parks",
        searchListClass: "search"
      })
    } else {
      this.setState({
        searchButtonClass: "button open-search",
        searchButtonText: "X",
        searchListClass: "search show"
      })
    }
  }

  filterVenues = (q, address) => {
    let filtered_venues = venues.filter(v => v.name.toLowerCase().includes(q.toLowerCase()));
    this.setState({
      venues: filtered_venues
    })
    if (filtered_venues.length == 1) {
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
    console.log(name)
    this.setState({
      query: name
    })
    this.filterVenues(name, address)
  }

  render() {
    return (
      <div className="SearchableApp">
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
              >{v.name}</li>
              )
            }
          </ul>
          <div
            className="bottom">
            <h3>{this.state.selectedAddress}</h3>
          </div>
        </div>
        <MapContainer venues={this.state.venues}/>
      </div>
    );
  }
}

export default SearchableApp;
