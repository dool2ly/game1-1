import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import '../scss/World.scss'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'
import { setAvatar, moveAvatar } from '../actions/Avatars'

import walkAvatar from '../img/Avatar.png'


function World(props) {
  const { handleAvatarsRef } = props
  const { setAvatar, moveAvatar } = props
  
  useEffect(() => {
    handleAvatarsRef.current = handleAvatars
  }, [handleAvatarsRef])

  const handleAvatars = (data) => {
    //Convert server base position to client base position
    data['location'][0] *= OBJECT_WIDTH
    data['location'][1] *= OBJECT_HEIGHT

    switch (data['state']) {
      case 'move':
        moveAvatar(data['name'], data['location'])
        break
      case 'set':
        setAvatar(data['name'], data['location'])
        break

      case 'unset':
        // setAvatars(prv => (
        //   prv.filter(info => info.name !== data['name'])
        // ))
        break
      default:
        return
    }
  }
  const test11 = () => {
    console.log(props.avatars)
  }

  return (
    <div className='world'>
      {props.avatars && props.avatars.map((avatar, i) => (
        <Avatar
          key={i}
          name={avatar['name']}
          pos={avatar['location']}
          canvasRef={avatar['canvasRef']}
        />
      ))}
      <button onClick={test11}>test</button>
    </div>
  )
}

export default connect(
  ({ avatars }) => ({ avatars }),
  { setAvatar, moveAvatar }
)(World)