import React, { Component } from 'react';

import Home from './components/Home'
import Game from './components/Game'
import './scss/App.scss'
import CSRFToken from './components/CSRFToken'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Home/>
        <CSRFToken/>
      </div>
    )
  }
}

export default App;
