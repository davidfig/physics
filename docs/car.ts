import * as PIXI from 'pixi.js'

import { Physics } from '../code/physics'

const WIDTH = 100
const HEIGHT = 50
const TINT = 0xff0000
const ACCELERATION = 0.0001
const MAX_SPEED = 0.25

export class Car extends PIXI.Container {
    sprite: PIXI.Sprite
    physics: Physics

    constructor() {
        super()
        this.sprite = this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        this.sprite.anchor.set(0.5)
        this.sprite.width = WIDTH
        this.sprite.height = HEIGHT
        this.sprite.tint = TINT
        this.physics = new Physics({
            acceleration: ACCELERATION,
            maxSpeed: MAX_SPEED,
        })
    }

    update(elapsedMs: number) {
        this.physics.update(elapsedMs)
        this.rotation = this.physics.angle
        this.position.set(...this.physics.position)
    }
}