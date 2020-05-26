import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { BACKEND_WS, OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'

function World(props) {
  // const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNzAiLCJ1c2VybmFtZSI6ImRvb2wybHkxMjM0IiwiZXhwIjoxNTkwMzkxMDYyLCJvcmlnX2lhdCI6MTU5MDMwNDY2MiwiaXNzIjoiZG9vbDJseSJ9.jxRif1ljplH-mXVgr5cpv4e-UpBuQgmkh8nbqhIAkgk'
  const testToken = props.token

  const webSocket = useRef(null)
  // ex) [{'name':'avatarName', 'location': [x,y]}, ...]
  const [avatars, setAvatars] = useState([])

  // ComponentDidMount
  useEffect(() => {
    if (testToken) {
      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', testToken)

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
        // TODO: redirect to Home, alert error message
      }

      props.gameCommandRef.current = handleGameCommand
  
      return () => webSocket.current.close() 
    } else {
      // TODO: redirect to Home, alert login message
    }
  }, [])

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
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}
export default connect(mapStateToProps)(World)