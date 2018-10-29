import React, { Component } from 'react';
import SearchableMap from './components/SearchableMap'
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 id='side-header' className='side-header'>Austin Dog Parks</h1>
        <SearchableMap />
      </div>
    );
  }
}

export default App;
