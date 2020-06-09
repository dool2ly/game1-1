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
    const handleMonsters = useRef(null)
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
                    const idx = moveCommands.indexOf(e.keyCode)
            
                    if (idx !== -1) {
                        e.preventDefault()
                        userCmdToServer('move', { direction: moveCommandsToServer[idx] })
                    }

                    if (e.keyCode === 32) { // 32: Space bar
                        e.preventDefault()
                        userCmdToServer('attack')
                    }
                }
            }
        }
    

        if (token) {
            window.addEventListener('keydown', handleKeyDown)

            webSocket.current = new WebSocket(BACKEND_WS + 'ws/game', token)

            webSocket.current.onclose = (e) => {
                console.log('disconnected game server')
                if (isMountedRef.current){
                    setToHome(true)
                }
            }

            webSocket.current.onmessage = (e) => {
                const jsonData = JSON.parse(e.data)
                if (jsonData['target'] !== 'monster') {
                    console.log("RECIEVE FROM SERVER", e.data)
                }
        
                switch (jsonData['target']) {
                    case 'avatar':
                        
                        handleAvatars.current(jsonData['data'])
                        break
                    case 'stats':
                        handleStats.current(jsonData['data'])
                        break
                    case 'monster':
                        handleMonsters.current(jsonData['data'])
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
            setToHome(true)
        }
    }, [token, moveCommands, moveCommandsToServer, isMountedRef])

    const userCmdToServer = (command, data=null) => {
        if (webSocket.current != null) {
            
            webSocket.current.send(JSON.stringify({ command, data }))
        }
    }

    return (
    <div className='game'>
        <div>
            <World handleAvatarsRef={handleAvatars} handleMonstersRef={handleMonsters} />
            <Chat handleChatRef={handleChat} />
        </div>
        <GameInfo handleStatsRef={handleStats} />
        {toHome && <Redirect to='/' />}
    </div>
    )
}

const mapStateToProps = (state) => {
    return {
        ...state.user
    }
}

export default connect(mapStateToProps)(Game)