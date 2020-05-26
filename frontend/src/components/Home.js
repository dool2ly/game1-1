import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import '../scss/Home.scss'
import * as elements from './Elements'
import { createAlert } from '../actions/AlertPortal'
import { login } from '../actions/User'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHome: false,
      username: '',
      password: '',
      menuWidth: 0,
      menuHeight: 0,
      contents: []
    }
  }


  componentDidMount() {
    this.setHomeState()
  }

  inputChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  handleError = (err) => {
    const { createAlert } = this.props
    const errors = err.response.data.errors
    let message = ''

    console.log(err.response) //test

    if (errors) {
      const stringErrors = errors.map(element => {
        console.log(element)
        switch(element) {
          case 'not_plain_username': return 'ID must be ENG or numeric.'
          case 'invalid_username': return 'Unavaliable ID.'
          case 'not_plain_password': return 'Password must be ENG or numeric.'
          case 'blank_username': return 'ID required.'
          case 'blank_password': return 'Password required.'
          case 'min_length_password': return 'Password is at least 4.'
          case 'max_length_username': return 'ID maximum length: 15'
          case 'exist_username': return 'ID already used.'
          case 'user_auth_fail': return 'Incorrect user information.'
          default: return 'Unknown response.'
        }
      })
      message = stringErrors.join('\n')
    }
    
    createAlert({ title: 'Bad request', message })
  }

  handleLogin = () => {
    const { username, password } = this.state
    const { createAlert, login } = this.props
    const title = 'Login'

    if (!username || !password) {
      createAlert({ title, message: 'Empty input.' })
    } else {
      axios.post(`api/user/${username}/login`, {password})
      .then(res => {
        login(res.data.token)
        this.props.history.push('/game')
      })
      .catch(this.handleError)
    }
  }

  handleCheck = () => {
    const { username } = this.state
    const { createAlert } = this.props
    const title = 'Check ID'

    if (!username) {
      createAlert({ title, message: 'Empty input.'})
    } else {
      // axios.get('api/user/' + username)
      axios.get('api/user/' + username)
      .then(res => {
        if (res.data.exists) {
          createAlert({ title, message: 'ID is already in use.'})
        } else {
          createAlert({ title, message: 'Available ID'})
        }
      })
      .catch(this.handleError)
    }
  }

  handleSignup = async () => {
    const { username, password } = this.state
    const { createAlert, login } = this.props
    const title = 'Sign-up'

    if (!username || !password) {
      createAlert({ title, message: 'Empty input.' })
    } else {
      try {
        // Login after sign-up
        await axios.post('api/user/' + username, { password })
        const res = await axios.post(`api/user/${username}/login`, { password })
        login(res.data.token)
        createAlert({ title, message: `Successfully registerd.\nWelcome ${username} !`})
        this.props.history.push('/game')
      } catch (err) {
        this.handleError(err)
      }
    }
  }

  setHomeState = () => {
    this.setState({
      isHome: true,
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
      isHome: false,
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
              type: 'text',
              onEnter: this.handleSignup
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD',
              text: 'Sign-up',
              onSubmit: this.handleSignup,
              type: 'password',
              onEnter: this.handleSignup
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
      isHome: false,
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
              type: 'text',
              onEnter: this.handleLogin
            },
            {
              name: 'password',
              onChange: this.inputChange,
              placeholder:'PASSWORD',
              type: 'password',
              onEnter: this.handleLogin
            }
          ]
        ),
        elements.WarningMsg('warn02'),
        elements.ButtonHome({ key: 'home02', text: 'Home', onClick: this.setHomeState })
      ]
    })
  }

  render() {
    const { menuWidth, menuHeight, contents, isHome } = this.state

    return (
      <div className='home'>
        { isHome && <div className='game-title'>Baram Online</div> }
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

export default connect(null, { createAlert, login })(Home)