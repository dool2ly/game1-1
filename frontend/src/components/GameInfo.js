import React from 'react'
import { connect } from 'react-redux'

import * as elements from './Elements'
import { logout } from '../actions/User'


function GameInfo(props) {
  return (
    <div className='game-info'>
      <div className='inventory'/>
      <div className='user-info'/>
      <div className='btn-container'>
        {elements.ButtonInMenu(1,'logout', props.logout)}
      </div>
    </div>
  )
}

export default connect(null, { logout })(GameInfo)
