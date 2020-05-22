import React from 'react'

import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../config/constants'
import walkPlayer from '../img/Player.png'

function Player() {
  return (
    <div style={{
        backgroundImage: `url('${walkPlayer}')`,
        width: PLAYER_WIDTH + 'px',
        height: PLAYER_HEIGHT + 'px'
    }}/>
  )
}

export default Player
