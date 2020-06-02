import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import '../scss/GameInfo.scss'
import * as elements from './Elements'
import { logout } from '../actions/User'


function InfoTable(props) {
  const infoTitle = "Inventory"
  return (
    <div className='info-container'>
      <div className='info-title'>{infoTitle}</div>
      <div className='inventory' />
    </div>
  )
}

function UserStats(props) {
  const { name, level, health, max_health, mana, max_mana, money } = props.stats
  const hpPer = health / max_health * 100
  const mpPer = mana / max_mana * 100

  return (
    <div className='user-info'>
      <div className='name'>{name}</div>
      <div className='level'>{level}</div>
      <div className='meter'>
        <span className='text'>{`${health}/${max_health}`}</span>
        <span className='hp-bar' style={{width: hpPer + '%'}} />
      </div>
      <div className='meter'>
        <span className='text'>{`${mana}/${max_mana}`}</span>
        <span className='mp-bar' style={{width: mpPer + '%'}} />
      </div>
      <div className='money'>{money}</div>
    </div>
  )
}

function GameInfo(props) {
  const { handleStatsRef } = props
  const [stats, setStats] = useState({
    name: '',
    level: 0,
    health: 0,
    mana: 0,
    money: 0
  })

  useEffect(() => {
    handleStatsRef.current = setStats
  }, [handleStatsRef])

  return (
    <div className='game-info'>
      <InfoTable />
      <UserStats stats={stats}/>
      <div className='btn-container'>
        {elements.ButtonInMenu(1, 'Logout', props.logout)}
      </div>
    </div>
  )
}

export default connect(null, { logout })(GameInfo)
