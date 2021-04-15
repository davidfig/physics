import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import { floor } from './floor'
import { Car } from './car'

const FIT = 2000

class Main {
    private renderer: PIXI.Renderer
    private stage: PIXI.Container
    private viewport: Viewport
    private car: Car
    private lastTime: number

    start() {
        this.renderer = new PIXI.Renderer({
            view: document.querySelector('.view'),
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio,
            backgroundAlpha: 0,
        })
        this.stage = new PIXI.Container()
        this.stage.addChild(floor)
        this.viewport = this.stage.addChild(new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        }))
        this.viewport.fit(false, FIT, FIT)
        floor.resize(window.innerWidth, window.innerHeight)
        this.viewport.moveCenter(0, 0)
        this.viewport.on('clicked', (data: any) => this.clicked(data))

        this.car = this.viewport.addChild(new Car())
        this.viewport.follow(this.car)

        this.lastTime = Date.now()
        this.update()
    }

    private clicked(data: any) {
        const global = data.event.data.global
        if (this.car.sprite.containsPoint(global)) {
            this.car.physics.stop()
        } else {
            this.car.physics.accelerateToAngle(Math.atan2(global.y - window.innerWidth / 2, global.x - window.innerHeight / 2))
        }
    }

    private update() {
        const now = Date.now()
        const elapsed = now - this.lastTime
        this.lastTime = now

        this.car.update(elapsed)
        floor.update(this.viewport)

        this.renderer.render(this.stage)
        requestAnimationFrame(() => this.update())
    }
}

const main = new Main()

window.onload = () => main.start()