import React, { Component } from 'react';

import Home from './components/Home'
import Game from './components/Game'
import './scss/App.scss'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Home/>
      </div>
    )
  }
}

export default App;
