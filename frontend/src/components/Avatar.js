import React, { useEffect, useState } from 'react'
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
  const posX = props.pos[0]
  const posY = props.pos[1]
  const myChats = props.chats.filter(item => item.chat.from === props.name)

  return (
    <div
      className='avatar' 
      style={{
        position: 'absolute',
        top: posY,
        left: posX,
        backgroundImage: `url('${walkAvatar}')`,
        width: OBJECT_WIDTH + 'px',
        height: OBJECT_HEIGHT + 'px'
      }}
    >
      { myChats.length !== 0 && <ChatBubble chat={myChats[0].chat} />}
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
