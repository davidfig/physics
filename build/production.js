import fs from 'fs-extra'

import { buildJs } from './js'

export async function production() {
    const packageJson = await fs.readJson('./package.json')
    console.log(`Deploying ${packageJson.name}...`)
    const cache = ``
    const dir = 'docs/'
    await buildJs(dir, cache, true)
    console.log(`${packageJson.name} v${packageJson.version} deployed to ${dir}`)
}