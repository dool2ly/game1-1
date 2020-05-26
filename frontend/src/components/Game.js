import React, { useRef, useEffect } from 'react'

import '../scss/Game.scss'
import Chat from './Chat'
import World from './World'
import GameInfo from './GameInfo'

function Game() {
  const chatInput = useRef(null)
  const gameCommand = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      chatInput.current.focus()
    } else {
      gameCommand.current(e.keyCode)
    }

  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)  
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className='game'>
      <div>
        <World gameCommandRef={gameCommand} />
        <Chat chatInputRef={chatInput} />
      </div>
      <GameInfo />
    </div>
  )
}

export default Game
