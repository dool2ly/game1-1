import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import '../scss/World.scss'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'
import Monster from './Monster'
import {
    setAvatar,
    moveAvatar,
    unsetAvatar,
    resetAvatar
} from '../actions/Avatars'
import { setMonster } from '../actions/Monsters'

function World(props) {
    const { handleAvatarsRef, handleMonstersRef } = props
    const { setAvatar, moveAvatar, unsetAvatar, resetAvatar } = props
    const { setMonster } = props

    useEffect(() => {
        handleAvatarsRef.current = (data) => {
            //Convert server base position to client base position
            data['location'][0] *= OBJECT_WIDTH
            data['location'][1] *= OBJECT_HEIGHT
        
            switch (data['state']) {
                case 'set':
                    setAvatar(data['name'], data['location'])
                    break
        
                case 'move':
                    moveAvatar(data['name'], data['location'])
                    break
            
                case 'unset':
                    unsetAvatar(data['name'])
                    break
        
                default:
                    return
            }
        }
    
        handleMonstersRef.current = (data) => {
            data['location'][0] *= OBJECT_WIDTH
            data['location'][1] *= OBJECT_HEIGHT

            switch (data['state']) {
                case 'set':
                    setMonster(data['id'], data['name'], data['location'])
                    break
                default:
                    return
            }
        }
    
        return () => {
            resetAvatar()
        }
    }, [handleAvatarsRef, handleMonstersRef, setAvatar, moveAvatar, unsetAvatar, resetAvatar, setMonster])
    
    return (
        <div className='world'>
            {props.avatars && props.avatars.map((avatar, i) => {
                if (avatar.active) {
                    return (
                        <Avatar
                            key={i}
                            name={avatar['name']}
                            pos={avatar['location']}
                        />
                    )
                } else {
                    return null
                }
            })}
            
            {props.monsters && props.monsters.map((monster, i) => (
                <Monster
                    key={'m' + i}
                    name={monster['name']}
                    pos={monster['location']}
                />
            ))}
        </div>
    )
}

export default connect(
    ({  avatars, monsters }) => ({  avatars, monsters }),
    { setAvatar, moveAvatar, unsetAvatar, resetAvatar, setMonster }
)(World)