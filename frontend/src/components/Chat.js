import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { BACKEND_WS } from '../config/constants'
import { createChat, closeChat } from '../actions/ChatBubble'

function Chat(props) {
  const maxLength = 20
  const webSocket = useRef(null)
  const messageEnd = useRef(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  
  

  // ComponentDidMount
  useEffect(() => {
    if (props.token) {
      // Websocket connection attempt
      webSocket.current = new WebSocket(BACKEND_WS + 'ws/chat/1', props.token)
  
      webSocket.current.onopen = () => {
        // Websocket connection success
        const alertMsg = "Chat server connected."
        setMessages([{'from':'System', 'message': alertMsg}])
      }
  
      webSocket.current.onmessage = (e) => {
        // Recieve data from backend, update data to messages
        const parsedData = JSON.parse(e.data)
        setMessages(prev => {
          
          if (prev.length === maxLength) {
            return [...prev.slice(1), parsedData]
          }
          return [...prev, parsedData]
          
        })
        
        props.createChat(
          parsedData,
          setTimeout(() => props.closeChat(parsedData['from']), 3000)
        )
        
        scrollToBottm()
      }
  
      webSocket.current.onclose = () => {
        // Websocket connection close
        const errorMsg = "Chat server disconnected, please restart."
        setMessages([{'from':'System Error', 'message': errorMsg}])
      }
  
      return () => webSocket.current.close()
    } else {
      // client does not have token 
      const errorMsg = "Please login"
      setMessages([{'from':'System Error', 'message': errorMsg}])
    }

  }, [])

  const inputChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.key==='Enter') {
      handleOnSubmit()
    }
  }

  const handleOnSubmit = () => {
    if (webSocket.current != null) {
      webSocket.current.send(JSON.stringify({ message }))
    }
    setMessage('')
  }

  const scrollToBottm = () => {
    messageEnd.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='chat'>
        <div className='text-area'>
          <ul>
            {messages && messages.map((chat, i) => (
              <li key={i}>
                <span>[{chat.from}]:&nbsp;</span>
                {chat.message}
              </li>
            ))}
          </ul>
          <div
            style={{ float:"left", clear: "both" }}
            ref={(el) => { messageEnd.current = el }}
          />
        </div>
        <div className='chat-form' >
          <input
            maxLength='40'
            autoComplete="off"
            type='text'
            name='message'
            placeholder='Type a Message'
            onChange={inputChange}
            onKeyDown={handleKeydown}
            value={message}
            required
          />
          <div className='submit' onClick={handleOnSubmit}>
            Send
          </div>
        </div>
      </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default connect(mapStateToProps, { createChat,closeChat })(Chat)