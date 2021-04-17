const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 180 / Math.PI
const PI_2 = Math.PI * 2

export function radiansToDegrees(n: number) {
    return n * RADIANS_TO_DEGREES
}

export function degreesToRadians(n: number) {
    return n * DEGREES_TO_RADIANS
}

/**
 * returns the normalized difference between two angles (in radians)
 * @param {number} a - first angle
 * @param {number} b - second angle
 * @return {number} normalized difference between a and b
 */
export function differenceAngles(a: number, b: number): number {
    const c = Math.abs(a - b) % PI_2
    return c > Math.PI ? (PI_2 - c) : c
}