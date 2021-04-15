import { Vec2, Vec2Like } from './vec2'
import * as angles from './angles'

export interface IPhysicsOptions {
    velocity?: Vec2
    position?: Vec2
    acceleration?: number
    maxSpeed?: number
    state?: PhysicsState
}

export enum PhysicsState {
    rest = 0,
    accelerating = 1,
    turning = 2,
    maxSpeed = 3,
    stopping = 4,
}

const defaultPhysicsOptions: IPhysicsOptions = {
    velocity: new Vec2(),
    position: new Vec2(),
    acceleration: 1,
    maxSpeed: 5,
    state: PhysicsState.rest,
}

export class Physics {
    protected options: IPhysicsOptions
    protected lastRadians = 0
    protected force = new Vec2()
    protected cachedAcceleration = new Vec2()
    protected timeLeft = 0

    constructor(options: IPhysicsOptions) {
        this.options = { ...defaultPhysicsOptions, ...options }
    }

    /**
     * applies a force to change the movement to a different direction and accelerate to maxSpeed in this direction
     * @param degrees - angle in degrees
     */
    moveAtAngle(degrees: number) {
        this.moveAtRadians(angles.degreesToRadians(degrees))
    }

    /**
     * applies a force to change the movement to a different direction and accelerate to maxSpeed in this direction
     * @param radians - angle in radians
     */
    moveAtRadians(radians: number) {
        if (radians !== this.lastRadians) {
            this.state = PhysicsState.accelerating
        }
    }

    /**
     * accelerate to desired speed in current direction
     * @param [speed=maxSpeed] - desired speed or maxSpeed
     */
    toSpeed(speed: number = this.maxSpeed) {
        this.timeLeft = Math.abs(speed - this.speed) / this.acceleration
        const angle = this.angle
        this.cachedAcceleration.x = Math.cos(angle) * this.acceleration
        this.cachedAcceleration.y = Math.sin(angle) * this.acceleration
        this.state = PhysicsState.accelerating
    }

    stop() {
        this.cachedAcceleration = this.velocity.clone().normalize().negative()
        this.cachedAcceleration.multiply(this.acceleration)
        this.timeLeft = this.speed / this.acceleration
        this.state = PhysicsState.stopping
    }

    private accelerate(elapsedMs: number) {
        if (elapsedMs >= this.timeLeft) {
            this.velocity.x += this.cachedAcceleration.x * this.timeLeft
            this.velocity.y += this.cachedAcceleration.y * this.timeLeft
            this.timeLeft = 0
            if (this.state === PhysicsState.stopping) {
                this.state = PhysicsState.rest
            } else if (this.state === PhysicsState.accelerating) {
                this.state = PhysicsState.maxSpeed
            }
        } else {
            this.velocity.x += this.cachedAcceleration.x * elapsedMs
            this.velocity.y += this.cachedAcceleration.y * elapsedMs
            this.timeLeft -= elapsedMs
        }
        // console.log(this.speed, this.timeLeft)
    }

    update(elapsedMs: number) {
        switch (this.state) {
            case PhysicsState.rest:
                return
            case PhysicsState.accelerating:
            case PhysicsState.stopping:
                this.accelerate(elapsedMs)
                break
            case PhysicsState.maxSpeed:
                break
        }
        this.x += this.velocity.x * elapsedMs
        this.y += this.velocity.y * elapsedMs
    }

    get state(): PhysicsState {
        return this.options.state
    }
    set state(state: PhysicsState) {
        this.options.state = state
    }

    /**
     * angle based on velocity in
     * @returns radians
     */
    get angle(): number {
        return this.velocity.angle()
    }

    get velocity(): Vec2 {
        return this.options.velocity
    }
    set velocity(velocity: Vec2Like) {
        if (!this.options.velocity.equal(velocity)) {
            this.options.velocity.copy(velocity)
            const angle = this.velocity.angle()
            this.cachedAcceleration.x = Math.cos(angle) * this.acceleration
            this.cachedAcceleration.y = Math.sin(angle) * this.acceleration
        }
    }

    /** current speed */
    get speed(): number {
        return this.velocity.magnitude()
    }

    get acceleration(): number {
        return this.options.acceleration
    }
    set acceleration(acceleration: number) {
        this.options.acceleration = acceleration
    }

    get position(): Vec2 {
        return this.options.position
    }
    set position(position: Vec2Like) {
        this.options.position.copy(position)
    }

    get maxSpeed(): number {
        return this.options.maxSpeed
    }
    set maxSpeed(maxSpeed: number) {
        this.options.maxSpeed = maxSpeed
    }

    get x(): number {
        return this.options.position[0]
    }
    set x(x: number) {
        this.options.position[0] = x
    }

    get y(): number {
        return this.options.position[1]
    }
    set y(y: number) {
        this.options.position[1] = y
    }
}