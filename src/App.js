import React, { Component } from 'react';
import SearchableMap from './components/SearchableMap'
import './App.css';

class App extends Component {
  render() {
    return (
      <section className="App">
        <aside id='side-header' className='side-header'>Austin Dog Parks</aside>
        <SearchableMap />
      </section>
    );
  }
}

export default App;
