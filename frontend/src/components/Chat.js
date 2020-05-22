import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { BACKEND_WS } from '../config/constants'

function Chat(props) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const webSocket = useRef(null)
  const maxLength = 5

  useEffect(() => {
    webSocket.current = new WebSocket(BACKEND_WS + 'ws/chat/1', props.token)
    // newMessageRef.currnet = newMessage

    webSocket.current.onopen = () => {
      console.log('chat server connected')
    }

    webSocket.current.onmessage = (e) => {
      // Update the data from server to messages
      setMessages(prev => {
        const parsedData = JSON.parse(e.data)

        if (prev.length === maxLength) {
          return [...prev.slice(1), parsedData]
        }
        return [...prev, parsedData]
      })
    }

    webSocket.current.onclose = () => {
      // TODO: please retry message
      console.log('chat server disconnected')
    }

    return () => webSocket.current.close()
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
    webSocket.current.send(JSON.stringify({ message }))
    setMessage('')
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
        </div>
        <div className='chat-form' >
          <input
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
export default connect(mapStateToProps)(Chat)