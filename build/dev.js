import { development } from './development'
import { reload } from './reload'
import { http } from './http'

async function start() {
    const dir = await development()
    await http(dir)
    reload.start()
}

start()