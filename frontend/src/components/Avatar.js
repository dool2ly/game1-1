import React from 'react'

import { AVATAR_WIDTH, AVATAR_HEIGHT } from '../config/constants'
import walkAvatar from '../img/Avatar.png'

function Avatar({ pos, name }) {
  const posX = pos[0]
  const posY = pos[1]
  return (
    <div
      className='avatar' 
      style={{
        position: 'absolute',
        top: posY,
        left: posX,
        backgroundImage: `url('${walkAvatar}')`,
        width: AVATAR_WIDTH + 'px',
        height: AVATAR_HEIGHT + 'px'
      }}
    >
      {/* TODO: chat bubble */}
      <span>{name}</span>
    </div>
  )
}

export default Avatar
