import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import '../scss/Home.scss'
import * as elements from './Elements.js'
import { createAlert } from '../actions/AlertPortal'


class Home extends Component {
  state = {
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
    const { createAlert } = this.props
    const title = 'Login'

    if (!username || !password) {
      createAlert({ title, message: 'Empty input.' })
    } else {
      axios.post(`user/${username}/login`, {password})
      .then(res => {
        console.log('res:', res.data)
      })
      .catch(err => {
        const status = err.response.status
        const message = err.response.data.message || `Status(${status}): error occured.`
        createAlert({ title, message })
      })
    }
  }

  handleCheck = () => {
    const { username } = this.state
    const { createAlert } = this.props
    const title = 'Check ID'

    if (!username) {
      createAlert({ title, message: 'Empty input.'})
    } else {
      axios.get('user/' + username)
      .then(res => {
        if (res.data.exists) {
          createAlert({ title, message: 'ID is already in use.'})
        } else {
          createAlert({ title, message: 'Available ID'})
        }
      })
      .catch(err => {
        const status = err.response.status
        const message = err.response.data.message || `Status(${status}): error occured.`
        createAlert({ title, message })
      })
    }
  }

  handleSignup = () => {
    const { username, password } = this.state
    const { createAlert } = this.props
    const title = 'Sign-up'

    if (!username || !password) {
      createAlert({ title, message: 'Empty input.' })
    } else {
      // Create user
      axios.post('user/' + username, { password })
      .then(res => {
        createAlert({ title, message: 'Welcome ' + username})
        this.props.history.push('/game')
      })
      .catch(err => {
        const status = err.response.status
        const message = err.response.data.message || `Status(${status}): error occured.`
        createAlert({ title, message })
      })
    }
  }

  setHomeState = () => {
    this.setState({
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
              onSubmit: this.handleCheck,
              type: 'text'
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD',
              text: 'Sign-up',
              onSubmit: this.handleSignup,
              type: 'password'
            }
          ]
        ),
        elements.WarningMsg('warn01'),
        elements.ButtonHome({ key: 'home01', text: 'Home', onClick: this.setHomeState })
      ]
    })
  }

  setLoginState = () => {
    this.setState({
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
              onSubmit: this.handleLogin,
              type: 'text'
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD',
              type: 'password'
            }
          ]
        ),
        elements.WarningMsg('warn02'),
        elements.ButtonHome({ key: 'home02', text: 'Home', onClick: this.setHomeState })
      ]
    })
  }

  render() {
    const { menuWidth, menuHeight, contents } = this.state

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

export default connect(null, { createAlert })(Home)