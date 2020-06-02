import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'

import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import walkAvatar from '../img/Avatar.png'


function ChatBubble(props) {
  return (
    <div className='chat-bubble'>
      <span>
        {props.chat.from}:&nbsp;
      </span>
      {props.chat.message}
    </div>
  )
}

function Avatar(props) {
  let currentTick = 0
  let currentFrame = 0
  const ticksPerFrame = 5
  const prevPosX = useRef()
  const prevPosY = useRef()
  const [posX, posY] = props.pos
  const canvasRef = useRef(null);
  const [avatarImg] = useState(new Image())
  const directionMap = { SOUTH: 0, WEST: 1, EAST: 2, NORTH: 3 }
  const myChats = props.chats.filter(item => item.chat.from === props.name)

  const avatar = (action, dir = 0) => {
    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')

      const draw = frame => {
        ctx.clearRect(0, 0, OBJECT_WIDTH, OBJECT_HEIGHT)
        ctx.drawImage(
          avatarImg,
          frame * OBJECT_WIDTH,
          dir * OBJECT_HEIGHT,
          OBJECT_WIDTH,
          OBJECT_HEIGHT,
          0,
          0,
          OBJECT_WIDTH,
          OBJECT_HEIGHT
        )
      }

      const update = () => {
        currentTick += 1
        if (currentTick > ticksPerFrame) {
          currentTick = 0
          currentFrame += 1;
        }
      }

      const main = () => {
        draw(currentFrame)
        update()
        const id = window.requestAnimationFrame(main)
        if (currentFrame > 3) {
          window.cancelAnimationFrame(id)
        }
      }

      if (action === 'draw') {
        draw(0)
      }
      if (action === 'animate') {
        main()
      }
    }
  }

  useEffect(() => {
    avatarImg.src = walkAvatar
    avatarImg.onload = () => {
      avatar('draw', 0)
    }
  }, [])

  useEffect(() => {
    prevPosX.current = posX
    prevPosY.current = posY
  }, [posX,posY])
  
  if (posX - prevPosX.current < 0) {
    avatar('animate', directionMap['WEST'])
  }
  if (posX - prevPosX.current > 0) {
    avatar('animate', directionMap['EAST'])
  }
  if (posY - prevPosY.current < 0) {
    avatar('animate', directionMap['NORTH'])
  }
  if (posY - prevPosY.current > 0) {
    avatar('animate', directionMap['SOUTH'])
  }

  return (
    <div className='avatar' style={{ top: posY, left: posX }}>
      { myChats.length !== 0 && <ChatBubble chat={myChats[0].chat} /> }
      <canvas ref={canvasRef} width={OBJECT_WIDTH} height={OBJECT_HEIGHT} />
      <div className='name-plate'><div>{props.name}</div></div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    chats: [...state.chat]

  }
}

export default connect(mapStateToProps)(Avatar)
