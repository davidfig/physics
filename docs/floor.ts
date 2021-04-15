import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

const SPACING = 100
const COLOR = 0xdddddd
const SIZE = 5

class Floor extends PIXI.Container {
    resize(width: number, height: number) {
        this.removeChildren()
        for (let y = 0; y < height + SPACING; y += SPACING) {
            for (let x = 0; x < width + SPACING; x += SPACING) {
                const box = this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
                box.position.set(x, y)
                box.width = box.height = SIZE
                box.anchor.set(0.5)
                box.tint = COLOR
            }
        }
    }

    update(viewport: Viewport) {
        this.position.set(viewport.x % SPACING, viewport.y % SPACING)
    }
}

export const floor = new Floor()