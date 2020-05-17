import React, { Component } from 'react'
import axios from 'axios'

import '../scss/Home.scss'
import * as elements from './Elements.js'

class Home extends Component {
  state = {
    home: false,
    username: '',
    password: '',
    menuWidth: 0,
    menuHeight: 0,
    contents: []
  }

  componentDidMount() {
    this.setHomeState()
  }

  inputChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLogin = () => {
    const { username, password } = this.state
    console.log('login:', username, password)
  }

  handleCheck = () => {
    const { username } = this.state
    console.log('Check:', username)
  }

  handleSignup = () => {
    const { username, password } = this.state

    axios.post('user/' + username, { password })
    .then(res => {
      console.log("res:", res.data.message)
    })
    .catch(err => {
      const message = err.response.data.message || 'error occured.'
      console.log("err:", message)
    })
  }


  setHomeState = () => {
    this.setState({
      home: true,
      username: '',
      password: '',
      menuWidth: 400,
      menuHeight: 270,
      contents: [
        elements.ButtonInMenu('main01', 'Sign-up', this.setSignupState),
        elements.ButtonInMenu('main02', 'Login', this.setLoginState)
      ]
    })
  }

  setSignupState = () => {
    this.setState({
      home: false,
      menuWidth: 400,
      menuHeight: 450,
      contents: [
        elements.MenuTitle('Sign-up'),
        elements.Forms(
          'forms01',
          [
            {
              name: 'username',
              onChange: this.inputChange,
              placeholder:'ID',
              text: 'Check',
              onSubmit: this.handleCheck
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD',
              text: 'Sign-up',
              onSubmit: this.handleSignup
            }
          ]
        ),
        elements.WarningMsg(),
        elements.ButtonHome({ key: 'home01', text: 'Home', onClick: this.setHomeState })
      ]
    })
  }

  setLoginState = () => {
    this.setState({
      home: false,
      menuWidth: 400,
      menuHeight: 450,
      contents: [
        elements.MenuTitle('Login'),
        elements.Forms(
          'forms02',
          [
            {
              name: 'username',
              onChange: this.inputChange,
              placeholder:'ID',
              text: 'Login',
              onSubmit: this.handleLogin
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD'
            }
          ]
        ),
        elements.WarningMsg(),
        elements.ButtonHome({ key: 'home02', text: 'Home', onClick: this.setHomeState })
      ]
    })
  }

  render() {
    const { home, menuWidth, menuHeight, contents } = this.state

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
