import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import '../scss/World.scss'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import Avatar from './Avatar'
import Monster from './Monster'
import {
    setAvatar,
    moveAvatar,
    attackAvatar,
    unsetAvatar,
    resetAvatar
} from '../actions/Avatar'
import {
    setMonster,
    moveMonster,
    unsetMonster,
    resetMonster,
    hitMonster
} from '../actions/Monster'

function World(props) {
    const { handleAvatarsRef, handleMonstersRef, handleEventRef } = props
    const { attackAvatar, setAvatar, moveAvatar, unsetAvatar, resetAvatar } = props
    const { setMonster, moveMonster , unsetMonster, resetMonster, hitMonster } = props

    useEffect(() => {
        handleAvatarsRef.current = (data) => {
            //Convert server base position to client base position
            data['location'][0] *= OBJECT_WIDTH
            data['location'][1] *= OBJECT_HEIGHT
        
            switch (data['state']) {
                case 'set':
                    setAvatar(data['name'], data['location'], data['direction'])
                    break
        
                case 'move':
                    moveAvatar(data['name'], data['location'], data['direction'])
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
                    setMonster(data['id'], data['name'], data['location'], data['hp'])
                    break
                
                case 'move':
                    moveMonster(data['id'], data['location'])
                    break
                
                default:
                    return
            }
        }

        handleEventRef.current = (data) => {
            switch (data['type']) {
                case 'attack':
                    attackAvatar(data['from'])
                    if (data['to']) {
                        hitMonster(data['to']['id'], data['to']['hp'])
                    }
                    
                default:
                    return
            }
            
        }
    
        return () => {
            resetAvatar()
            resetMonster()
        }
    }, [handleEventRef, handleAvatarsRef, handleMonstersRef, setAvatar, moveAvatar, attackAvatar, unsetAvatar, resetAvatar, setMonster, moveMonster, unsetMonster, resetMonster, hitMonster])
    
    return (
        <div className='world'>
            {props.avatar && props.avatar.map((avatar, i) => {
                if (avatar.active) {
                    return (
                        <Avatar
                            key={i}
                            name={avatar['name']}
                            pos={avatar['location']}
                            attack={avatar['attack']}
                            direction={avatar['direction']}
                        />
                    )
                } else {
                    return null
                }
            })}
            
            {props.monster && props.monster.map((monster, i) => (
                <Monster
                    key={'m' + i}
                    name={monster['name']}
                    hp={monster['hp']}
                    pos={monster['location']}
                    attack={monster['attack']}
                />
            ))}
        </div>
    )
}

const mapStateToProps = ({ avatar, monster }) => ({ avatar, monster })
const mapDispatchToProps = {
    setAvatar,
    moveAvatar,
    attackAvatar,
    unsetAvatar,
    resetAvatar,
    setMonster,
    moveMonster,
    unsetMonster,
    resetMonster,
    hitMonster   
}

export default connect(mapStateToProps, mapDispatchToProps)(World)