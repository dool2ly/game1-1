import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { AVATAR_WIDTH, AVATAR_HEIGHT } from '../config/constants'
import walkAvatar from '../img/Avatar.png'


function ChatBubble(props) {
  console.log("inBubble",props)
  return (
    
    <div className='chat-bubble'>
      {console.log('render!!')}
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
        width: AVATAR_WIDTH + 'px',
        height: AVATAR_HEIGHT + 'px'
      }}
    >
      { myChats.length !== 0 && <ChatBubble chat={myChats[0].chat} />}
      <div className='name-plate'>{props.name}</div>
    </div>
  )
}

const mapStateToProps = (state) => {
  
  return {
    chats: [...state.chat]
  }
}

export default connect(mapStateToProps)(Avatar)
