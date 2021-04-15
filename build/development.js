import chokidar from 'chokidar'

import { reload } from './reload'
import { buildJs } from './js'

let _cache, _dir

async function watch() {
    const awaitWriteFinish = {
        stabilityThreshold: 250,
        pollInterval: 100
    }

    const jsWatch = chokidar.watch(['docs/**/*.ts', 'code/**/*.ts'], { awaitWriteFinish })
    jsWatch.on('change', async file => {
        reload.lock()
        console.log(`javascript ${file} changed...`)
        await buildJs(_dir, _cache, false)
        reload.signal()
    })
}

export async function development() {
    _cache = ''
    _dir = 'docs/'
    await buildJs(_dir, _cache, false)
    watch()
    return _dir
}