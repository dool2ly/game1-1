import React, { useState, useEffect } from 'react'

import '../scss/World.scss'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'


function World(props) {
  const { handleAvatarsRef } = props
  const [avatars, setAvatars] = useState([])// ex) [{'name':'avatarName', 'location': [x,y]}, ...]

  useEffect(() => {
    handleAvatarsRef.current = handleAvatars
  }, [handleAvatarsRef])

  const handleAvatars = (data) => {
    //Convert server base position to client base position
    data['location'][0] *= OBJECT_WIDTH
    data['location'][1] *= OBJECT_HEIGHT

    switch (data['state']) {
      case 'set':
        setAvatars(prv => (
          prv.filter(info => info.name !== data['name'])
          .concat({ name: data['name'], location: data['location'] })
        ))
        break

      case 'unset':
        setAvatars(prv => (
          prv.filter(info => info.name !== data['name'])
        ))
        break
      default:
        return
    }
  }

  return (
    <div className='world'>
      {avatars && avatars.map((avatar, i) => (
        <Avatar key={i} pos={avatar['location']} name={avatar['name']} />
      ))}
    </div>
  )
}

export default World