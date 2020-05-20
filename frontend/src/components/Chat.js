import React, { Component } from 'react'

class Chat extends Component {
  state = {
    message: ''
  }

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOnSubmit= () => {
    console.log('test')
    console.log(this.state.message)
  }
  
  render() {
    const { handleOnSubmit } = this
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
          <div className='submit' onClick={handleOnSubmit}>
            Send
          </div>
        </div>
      </div>
    )
  }
  
}

export default Chat
