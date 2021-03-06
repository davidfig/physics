import { Vec2, Vec2Like } from './vec2'
import * as angles from './angles'

const MIN_ANGLE = 0.01

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
    cruising = 3,
    stopping = 4,
}

const defaultPhysicsOptions: IPhysicsOptions = {
    velocity: new Vec2(),
    position: new Vec2(),
    acceleration: 1,
    maxSpeed: 5,
    state: PhysicsState.rest,
}

interface IPhysicsTo {
    angle?: number
    speed?: number
    timeLeft?: number
    velocity: Vec2
}

export class Physics {
    protected options: IPhysicsOptions
    protected lastRadians = 0
    protected force = new Vec2()
    protected cachedAcceleration = new Vec2()
    protected to: IPhysicsTo = {
        velocity: new Vec2()
    }

    constructor(options: IPhysicsOptions = {}) {
        this.options = { ...defaultPhysicsOptions, ...options }
    }

    /**
     * applies a force to change the movement to a different direction and accelerate to maxSpeed in this direction
     * @param degrees - angle in degrees
     */
    accelerateToDegrees(degrees: number, speed: number = this.maxSpeed) {
        this.accelerateToAngle(angles.degreesToRadians(degrees), speed)
    }

    /**
     * applies a force to change the movement to a different direction and accelerate to maxSpeed in this direction
     * @param radians - angle in radians
     */
    accelerateToAngle(radians: number, speed: number = this.maxSpeed) {
        if (radians !== this.lastRadians) {
            this.state = PhysicsState.turning
            this.to.velocity.direction(radians, speed)
            this.to.angle = radians
            this.to.speed = speed
        } else {
            if (this.speed !== speed) {
                this.toSpeed(speed)
            }
        }
    }

    /**
     * accelerate to desired speed in current direction
     * @param [speed=maxSpeed] - desired speed or maxSpeed
     */
    toSpeed(speed: number = this.maxSpeed) {
        this.to.timeLeft = Math.abs(speed - this.speed) / this.acceleration
        const angle = this.angle
        this.cachedAcceleration.x = Math.cos(angle) * this.acceleration
        this.cachedAcceleration.y = Math.sin(angle) * this.acceleration
        this.state = PhysicsState.accelerating
    }

    stop() {
        this.cachedAcceleration = this.velocity.clone().normalize().negative()
        this.cachedAcceleration.multiply(this.acceleration)
        this.to.timeLeft = this.speed / this.acceleration
        this.state = PhysicsState.stopping
    }

    protected accelerate(elapsedMs: number) {
        if (elapsedMs >= this.to.timeLeft) {
            this.lastRadians = this.velocity.angle()
            this.velocity.x += this.cachedAcceleration.x * this.to.timeLeft
            this.velocity.y += this.cachedAcceleration.y * this.to.timeLeft
            this.to.timeLeft = 0
            if (this.state === PhysicsState.stopping) {
                this.state = PhysicsState.rest
            } else if (this.state === PhysicsState.accelerating) {
                this.state = PhysicsState.cruising
            }
        } else {
            this.velocity.x += this.cachedAcceleration.x * elapsedMs
            this.velocity.y += this.cachedAcceleration.y * elapsedMs
            this.to.timeLeft -= elapsedMs
        }
    }

    protected turn(elapsedMs: number) {
        const delta = Vec2.subtract(this.to.velocity, this.velocity).normalize()
        this.velocity.x += delta.x * this.acceleration * elapsedMs
        this.velocity.y += delta.y * this.acceleration * elapsedMs
        if (angles.differenceAngles(this.velocity.angle(), this.to.angle) < MIN_ANGLE) {
            this.toSpeed(this.to.speed)
        }
    }

    update(elapsedMs: number) {
        switch (this.state) {
            case PhysicsState.rest:
                return
            case PhysicsState.accelerating:
            case PhysicsState.stopping:
                this.accelerate(elapsedMs)
                break
            case PhysicsState.turning:
                this.turn(elapsedMs)
                break
            case PhysicsState.cruising:
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
        if (this.velocity.isZero()) {
            return this.lastRadians
        } else {
            return this.velocity.angle()
        }
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