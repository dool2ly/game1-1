import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { BACKEND_WS, AVATAR_WIDTH, AVATAR_HEIGHT } from '../config/constants'
import Avatar from './Avatar'

function World(props) {
  // TODO: Token authrization from server, fail:redirect, success:game
  // TODO: Connect websocket to Game server and add avatar, World
  
  // const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjEiLCJ1c2VybmFtZSI6ImMxMjMiLCJleHAiOjE1OTAzMDAyNDIsIm9yaWdfaWF0IjoxNTkwMjEzODQyLCJpc3MiOiJkb29sMmx5In0.cHv8bDaE0228BMHGxw8agsDprpT4XwZyBElLB8UhXQw'
  const testToken = props.token

  const webSocket = useRef(null)
  // ex) [{'avatar':'avatarName', 'location': [x,y]}, ...]
  const [avatars, setAvatars] = useState([])

  // ComponentDidMount
  useEffect(() => {
    if (testToken) {

      // Set event handler for control avatar
      window.addEventListener('keydown', (event) =>{
        const validKey = [37, 38, 39, 40] // Left, Up, Right, Down arrows
        const key = event.keyCode
        if (validKey.indexOf(key) !== -1) {
          event.preventDefault()
          handleCommand(key)
        }
      })

      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', testToken)

      webSocket.current.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)

        switch (jsonData['action']) {
          case 'set_avatar':
            handleAction(jsonData['data'])
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
  
      return () => webSocket.current.close() 
    } else {
      // TODO: redirect to Home, alert login message
    }
  }, [])

  const handleAction = (data) => {
    // Convert server base position to client base position
    data['location'][0] *= AVATAR_WIDTH
    data['location'][1] *= AVATAR_HEIGHT

    setAvatars(prv => prv.filter(info => info.avatar !== data['avatar']).concat(data))
  }

  function handleCommand(key) {
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

  function testBtn() {
    const command = 'test'
    const data = '1'
    webSocket.current.send(JSON.stringify({ command, data }))
  }

  return (
    <div className='world'>
      {avatars && avatars.map((avatar, i) => (
        <Avatar key={i} pos={avatar['location']} name={avatar['avatar']} />
      ))}
      {/* <Avatar pos={[100,100]} name='tester' /> */}
      {/* <button onClick={testBtn} style={{position: 'relative', top: 100}}>test</button> */}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}
export default connect(mapStateToProps)(World)