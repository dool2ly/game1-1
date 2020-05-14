import React, { Component } from 'react'

import '../scss/Home.scss'

const ButtonInHome = (text, onClick) =>(
  <div key={text} className='menu-btn' onClick={onClick}>
    <p>{text}</p>
  </div>
)

class Home extends Component {
  state = {
    menuWidth: 0,
    menuHeight: 0,
    contents: []
  }

  componentDidMount() {
    this.setHomeState()
  }

  setHomeState = () => {
    const contents = [
      ButtonInHome('Sign-in', this.setSigninState),
      ButtonInHome('Login', this.setLoginState)
    ]
    this.setState({
      menuWidth: 400,
      menuHeight: 270,
      contents: contents
    })
  }

  setSigninState = () => {
    this.setState({
      menuWidth: 400,
      menuHeight: 400,
      contents: [1, 2]
    })
  }
  setLoginState = () => {
    this.setState({
      menuWidth: 200,
      menuHeight: 200,
      contents: [1, 2]
    })
  }

  render() {
    const { now, menuWidth, menuHeight, contents } = this.state

    return (
      <div className='home'>
        <div className='menu'
          style={{
            width: `${menuWidth}px`,
            height: `${menuHeight}px`
          }}
        >
          {contents}
        </div>
      </div>
    )
  }
}

export default Home
