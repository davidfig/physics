const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 180 / Math.PI

export function radiansToDegrees(n: number) {
    return n * RADIANS_TO_DEGREES
}

export function degreesToRadians(n: number) {
    return n * DEGREES_TO_RADIANS
}
