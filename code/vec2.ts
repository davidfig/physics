export type Vec2Like = Vec2 | number[]

const FIDELITY = 0.000000001

export class Vec2 extends Array {
    dirty: boolean

    constructor(x: number = 0, y: number = 0) {
        super()
        this[0] = x
        this[1] = y
        this.dirty = true
    }

    get x() {
        return this[0]
    }
    set x(value: number) {
        this[0] = value
        this.dirty = true
    }

    get y() {
        return this[1]
    }
    set y(value: number) {
        this[1] = value
        this.dirty = true
    }

    set(x: number, y?: number) {
        this[0] = x
        this[1] = (typeof y === 'undefined') ? x : y
        this.dirty = true
    }

    multiply(multiply: number): Vec2 {
        this[0] *= multiply
        this[1] *= multiply
        this.dirty = true
        return this
    }

    divide(divide: number): Vec2 {
        console.assert(divide !== 0, 'Cannot divide by 0')
        this[0] /= divide
        this[1] /= divide
        this.dirty = true
        return this
    }

    negative(): Vec2 {
        this[0] = -this[0]
        this[1] = -this[1]
        this.dirty = true
        return this
    }

    normalize(): Vec2 {
        const magnitude = this.magnitude()
        return this.divide(magnitude)
    }

    magnitude(): number {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1])
    }

    angle(): number {
        return Math.atan2(this[1], this[0])
    }

    clone() {
        return new Vec2(this[0], this[1])
    }

    copy(copy: Vec2Like) {
        this[0] = copy[0]
        this[1] = copy[1]
        this.dirty = true
    }

    equal(vec: Vec2Like, fidelity = FIDELITY) {
        return Math.abs(vec[0] - this[0]) <= fidelity && Math.abs(vec[1] - this[1]) <= fidelity
    }
}