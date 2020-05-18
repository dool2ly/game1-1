import React, { Component } from 'react';

import './scss/App.scss'
import Home from './components/Home'
import Game from './components/Game'
import CSRFToken from './components/CSRFToken'
import AlertPortal from './components/AlertPotal'

class App extends Component {
  render() {
    return (
      <div>
        <div className="app">
          <Home/>
          <CSRFToken/>
          
        </div>
        <AlertPortal />
      </div>
    )
  }
}

export default App;
