import React, { useEffect } from 'react'

import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'
import walkDeer from '../img/Deer.png'
import withAnimation from './withAnimation'

function Monster(props) {
    const [posX, posY] = props.pos
    const hpPer = props.hp[0] / props.hp[1] * 100
    
    useEffect(() => {
        props.walkImg.src = walkDeer
    }, [props.walkImg])

    return (
        <div className='monster' style={{ top: posY, left: posX }}>
            <div className='meter'>
                <span className='hp-bar' style={{width: hpPer + '%'}} />
            </div>
            <canvas ref={props.canvasRef} width={OBJECT_WIDTH} height={OBJECT_HEIGHT} />
            <div className='name-plate'><div>{props.name}</div></div>
        </div>
    )
}

export default withAnimation(Monster)