import React, { useEffect } from 'react'

import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import walkDeer from '../img/walkDeer.png'
import walkPig from '../img/walkPig.png'
import withAnimation from './withAnimation'

function Monster(props) {
    const [posX, posY] = props.pos
    const hpPer = props.hp[0] / props.hp[1] * 100
    
    useEffect(() => {
        if (props.name === 'Pig') {
            props.walkImg.src = walkPig
        } else if (props.name === 'Deer') {
            props.walkImg.src = walkDeer
        }
    }, [props.walkImg, props.name])

    return (
        <div className='monster' style={{ top: posY, left: posX }}>
            { hpPer < 100 &&
                <div className='meter'>
                    <span className='hp-bar' style={{width: hpPer + '%'}} />
                </div>
            }
            <canvas ref={props.canvasRef} width={OBJECT_WIDTH} height={OBJECT_HEIGHT} />
            <div className='name-plate'><div>{props.name}</div></div>
        </div>
    )
}

export default withAnimation(Monster)