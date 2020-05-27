import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import '../scss/Game.scss'
import Chat from './Chat'
import World from './World'
import GameInfo from './GameInfo'
import { BACKEND_WS } from '../config/constants'

function Game(props) {
  const { token } = props
  const webSocket = useRef(null)
  const handleChat = useRef(null)
  const handleWorld = useRef(null)
  const handleGameInfo = useRef(null)
  const [toHome, setToHome] = useState(false)
  const moveCommands = [37, 38, 39, 40]
  const moveCommandsToServer = ['left', 'up', 'right', 'down']
  
  // ComponentDidMount
  useEffect(() => {
    const handleKeyDown = (e) => {
      // User input handler
  
      if (e.key === 'Enter') {
        handleChat.current.focus()
      } else {
        let idx = moveCommands.indexOf(e.keyCode)
        if (idx !== -1){
          e.preventDefault()
          UserCmdToServer('move', moveCommandsToServer[idx])
        }
      }
    }

    if (token) {
      window.addEventListener('keydown', handleKeyDown)

      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', token)

      webSocket.current.onclose = (e) => {
        console.log(e)
        // Websocket connection close
        console.log('disconnected game server')
        setToHome(true)
      }

      webSocket.current.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)
        console.log(e.data)

        switch (jsonData['target']) {
          case 'avatar':
            handleWorld.current(jsonData['data'])
            break
          default:
            return
        }
      }
  
      // componentWillUnmount
      return () => {
        webSocket.current.close()
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      // if does not have a token, redirect to home
      setToHome(true)
    }
  }, [token, moveCommands, moveCommandsToServer])

  const UserCmdToServer = (command, direction) => {
    if (webSocket.current != null) {
      webSocket.current.send(JSON.stringify({ command, data: { direction } }))
    }
  }

  return (
    <div className='game'>
      {toHome && <Redirect to='/' />}
      <div>
        <World worldRef={handleWorld} />
        <Chat chatRef={handleChat} />
      </div>
      <GameInfo gameInfoRef={handleGameInfo} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps)(Game)