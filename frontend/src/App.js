import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'

import './scss/App.scss'
import Home from './components/Home'
import Game from './components/Game'
import CSRFToken from './components/CSRFToken'
import AlertPortal from './components/AlertPotal'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='app'>
          <Route path='/' exact component={Home} />
          <Route path='/game' component={Game} />
          <Redirect path='*' to='/' />
          <AlertPortal />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
