import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { BACKEND_WS } from '../config/constants'

function Chat(props) {
  const [message, setMessage] = useState('')
  const webSocket = useRef(null)

  useEffect(() => {
    webSocket.current = new WebSocket(BACKEND_WS + 'ws/chat/1', props.token)

    webSocket.current.onopen = () => {
      console.log('chat server connected')
    }

    webSocket.current.onmessage = (e) => {
      console.log('recv:', e.data)
    }

    webSocket.current.onclose = () => {
      console.log('chat server disconnected')
    }

    return () => webSocket.current.close()
  }, [])

  const inputChange = (e) => {
    setMessage(e.target.value)
  }

  const handleTest = () => {
    console.log(props.token)
  }

  const handleOnSubmit = () => {
    console.log('submitHandle')
    webSocket.current.send(JSON.stringify({ message }))
  }

  return (
    <div className='chat'>
        <div className='text-area'>
          chatings
        </div>
        <div className='chat-form' >
          <input
            type='text'
            name='message'
            placeholder='Type a Message'
            onChange={inputChange}
            required
          />
          <div className='test-submit' onClick={handleTest}>
            Test
          </div>
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