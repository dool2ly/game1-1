import React, { Component } from 'react'

import WebSocketInstance from './WebSocket'

export default class Chat extends Component {
  // ws = new WebSocket('ws://localhost:8000/ws/chat')
  ws = new WebSocket('ws://localhost:8000/ws/chat/test_room')

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('ws connected')
    }

    this.ws.onclose = () => {
      console.log('ws disconnected')
    }
  }
  handleTest = () => {
    console.log('test btn')
  }

  render() {
    const { handleOnSubmit, handleTest } = this
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
}