import React, { useEffect, useRef, useState } from 'react'
import { OBJECT_WIDTH, OBJECT_HEIGHT } from '../config/constants'


function withAnimation(InputComponent) {
    return function(props) {
        let currentTick = 0
        let currentFrame = 0
        const ticksPerFrame = 5
        const prevPosX = useRef()
        const prevPosY = useRef()
        const canvasRef = useRef(null)
        const [objectImg] = useState(new Image())
        const directionMap = { down: 0, left: 1, right: 2, up: 3 }

        const handleCanvas = (action, dir = 0) => {
            if (canvasRef && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d')

                const draw = frame => {
                    ctx.clearRect(0, 0, OBJECT_WIDTH, OBJECT_HEIGHT)
                    ctx.drawImage(
                        objectImg,
                        frame * OBJECT_WIDTH,
                        dir * OBJECT_HEIGHT,
                        OBJECT_WIDTH,
                        OBJECT_HEIGHT,
                        0,
                        0,
                        OBJECT_WIDTH,
                        OBJECT_HEIGHT
                    )
                }

                const update = () => {
                    currentTick += 1
                    if (currentTick > ticksPerFrame) {
                        currentTick = 0
                        currentFrame += 1;
                    }
                }

                const main = () => {
                    draw(currentFrame)
                    update()
                    const id = window.requestAnimationFrame(main)
                    if (currentFrame > 3) {
                        window.cancelAnimationFrame(id)
                    }
                }

                if (action === 'draw') {
                    draw(0)
                }
                if (action === 'animate') {
                    main()
                }
            }
        }

        useEffect(() => {            
            objectImg.onload = () => {
                handleCanvas(
                    'draw',
                    props.direction? directionMap[props.direction] : 0
                )
            }
        }, [])

        useEffect(() => {
            prevPosX.current = props.pos[0]
            prevPosY.current = props.pos[1]
        }, [props.pos])
        useEffect(() => {})

        if (props.pos[0] - prevPosX.current < 0) {
            handleCanvas('animate', directionMap['left'])
        } else if (props.pos[0] - prevPosX.current > 0) {
            handleCanvas('animate', directionMap['right'])
        } else if (props.pos[1] - prevPosY.current < 0) {
            handleCanvas('animate', directionMap['up'])
        } else if (props.pos[1] - prevPosY.current > 0) {
            handleCanvas('animate', directionMap['down'])
        } else if (props.direction) {
            handleCanvas('draw', directionMap[props.direction])
        }

        return <InputComponent {...props} canvasRef={canvasRef} objectImg={objectImg} />
    }
}

export default withAnimation