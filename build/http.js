import express from 'express'
import fs from 'fs-extra'

const PORT = 1234

async function readPackage() {
    return await fs.readJson('./package.json')
}

export function http(dir) {
    return new Promise(async resolve => {
        const p = await readPackage()
        const app = express()
        app.use('/', express.static(dir))
        const port = PORT
        app.listen(port, () => {
            console.log(`${p.name} v${p.version} running at http://localhost:${PORT}`)
            resolve()
        })
    })
}
