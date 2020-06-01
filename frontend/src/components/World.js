import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import '../scss/World.scss'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'
import {
  setAvatar,
  moveAvatar,
  unsetAvatar,
  resetAvatar } from '../actions/Avatars'


function World(props) {
  const { handleAvatarsRef } = props
  const { setAvatar, moveAvatar, unsetAvatar, resetAvatar } = props

  useEffect(() => {
    handleAvatarsRef.current = (data) => {
      //Convert server base position to client base position
      data['location'][0] *= OBJECT_WIDTH
      data['location'][1] *= OBJECT_HEIGHT
  
      switch (data['state']) {
        case 'set':
          setAvatar(data['name'], data['location'])
          break
  
        case 'move':
          moveAvatar(data['name'], data['location'])
          break

        case 'unset':
          unsetAvatar(data['name'])
          break
  
        default:
          return
      }
    }
    return () => {
      resetAvatar()
    }
  }, [handleAvatarsRef, setAvatar, moveAvatar, unsetAvatar, resetAvatar])

  return (
    <div className='world'>
      {props.avatars && props.avatars.map((avatar, i) => {
        if (avatar.active) {
          return (
            <Avatar
              key={i}
              name={avatar['name']}
              pos={avatar['location']}
            />
          )
        }  
      })}
    </div>
  )
}

export default connect(
  ({ avatars }) => ({ avatars }),
  { setAvatar, moveAvatar, unsetAvatar, resetAvatar }
)(World)