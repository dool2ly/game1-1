import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { BACKEND_WS, OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import { createAlert } from '../actions/AlertPortal'
import Avatar from './Avatar'

function World(props) {
  const webSocket = useRef(null)
  const { gameCommandRef, token, createAlert } = props
  const [avatars, setAvatars] = useState([])// ex) [{'name':'avatarName', 'location': [x,y]}, ...]
  const [toHome, setToHome] = useState(false)

  // ComponentDidMount
  useEffect(() => {
    if (token) {
      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', token)

      webSocket.current.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)

        switch (jsonData['target']) {
          case 'avatar':
            handleAvatar(jsonData['data'])
            break
          default:
            return
        }
      }
  
      webSocket.current.onclose = () => {
        // Websocket connection close
        console.log('disconnected game server')
        setToHome(true)
      }

      gameCommandRef.current = handleGameCommand
  
      return () => webSocket.current.close() 
    } else {
      // if does not have a token, redirect to home
      setToHome(true)
    }
  }, [gameCommandRef, token])

  const handleAvatar = (data) => { 
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

  function handleGameCommand(key) {
    if (webSocket.current != null) {
      let command = 'move'
      let direction = ''
      switch (key) {
        case 37:
          direction = 'left'
          break
        case 38:
          direction = 'up'
          break
        case 39:
          direction = 'right'
          break
        case 40:
          direction = 'down'
          break
        default: return
      }
      webSocket.current.send(JSON.stringify({ command, data: { direction } }))
    }
  }

  return (
    <div className='world'>
      {avatars && avatars.map((avatar, i) => (
        <Avatar key={i} pos={avatar['location']} name={avatar['name']} />
      ))}
      {toHome && <Redirect to='/' />}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}
export default connect(mapStateToProps, { createAlert })(World)