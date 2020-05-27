import React, { useState, useEffect } from 'react'

import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'

function World(props) {
  const { worldRef } = props
  const [avatars, setAvatars] = useState([])// ex) [{'name':'avatarName', 'location': [x,y]}, ...]

  useEffect(() => {
    worldRef.current = handleData
  }, [worldRef])

  const handleData = (data) => { 
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

  // function handleGameCommand(key) {
  //   if (webSocket.current != null) {
  //     let command = 'move'
  //     let direction = ''
  //     switch (key) {
  //       case 37:
  //         direction = 'left'
  //         break
  //       case 38:
  //         direction = 'up'
  //         break
  //       case 39:
  //         direction = 'right'
  //         break
  //       case 40:
  //         direction = 'down'
  //         break
  //       default: return
  //     }
  //     webSocket.current.send(JSON.stringify({ command, data: { direction } }))
  //   }
  // }

  return (
    <div className='world'>
      {avatars && avatars.map((avatar, i) => (
        <Avatar key={i} pos={avatar['location']} name={avatar['name']} />
      ))}
    </div>
  )
}

export default World