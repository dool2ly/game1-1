import React from 'react'

import '../scss/Game.scss'
import Chat from './Chat'
import World from './World'
import GameInfo from './GameInfo'

function Game() {
  // TODO: Token authrization from server
  return (
    <div className='game'>
      <div>
        <World />
        <Chat />
      </div>
      <GameInfo />
    </div>
  )
}

export default Game
