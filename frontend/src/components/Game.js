import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Chat from './Chat'
import World from './World'
import GameInfo from './GameInfo'
import { useIsMountedRef } from './utils'
import { BACKEND_WS, ANIMATION_SPEED } from '../config/constants'


function Game(props) {
  const { token } = props
  const webSocket = useRef(null)
  const handleChat = useRef(null)
  const handleStats = useRef(null)
  const handleAvatars = useRef(null)
  const isMountedRef = useIsMountedRef()
  const [toHome, setToHome] = useState(false)
  const moveCommands = [37, 38, 39, 40]
  const moveCommandsToServer = ['left', 'up', 'right', 'down']
  
  
  // ComponentDidMount
  useEffect(() => {
    let timeStamp = 0

    // User input handler
    const handleKeyDown = (e) => {
      if (timeStamp + ANIMATION_SPEED < Date.now()) {
        timeStamp = Date.now()

        if (e.key === 'Enter') {
          handleChat.current.focus()
        } else {
          let idx = moveCommands.indexOf(e.keyCode)
          if (idx !== -1){
            e.preventDefault()
            UserCmdToServer('move', { direction: moveCommandsToServer[idx] })
          }
        }
      }
    }

    if (token) {
      window.addEventListener('keydown', handleKeyDown)

      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', token)

      webSocket.current.onclose = (e) => {
        // Websocket connection close
        console.log('disconnected game server')
        if (isMountedRef.current){
          setToHome(true)
        }
      }

      webSocket.current.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)
        console.log("RECIEVE FROM SERVER", e.data)

        switch (jsonData['target']) {
          case 'avatar':
            handleAvatars.current(jsonData['data'])
            break
          case 'stats':
            handleStats.current(jsonData['data'])
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
      // setTimeout(()=> setToHome(true), 3000)
      setToHome(true)
    }
  }, [token, moveCommands, moveCommandsToServer, isMountedRef])

  const UserCmdToServer = (command, data) => {
    if (webSocket.current != null) {
      webSocket.current.send(JSON.stringify({ command, data }))
    }
  }

  return (
    <div className='game'>
      {toHome && <Redirect to='/' />}
      <div>
        <World handleAvatarsRef={handleAvatars} />
        <Chat handleChatRef={handleChat} />
      </div>
      <GameInfo handleStatsRef={handleStats} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps)(Game)