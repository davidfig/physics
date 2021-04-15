import WebSocket from 'ws'

const PORT = 1235

class Reload {
    start() {
        this.wss = new WebSocket.Server({ port: PORT })
        this.wss.on('connection', websocket => {
            this._websocket = websocket
        })
        console.log(`live reload socket server running on port ${PORT}`)
        this._locked = 0
    }

    lock() {
        this._locked++
    }

    signal() {
        this._locked--
        if (this._locked === 0) {
            console.log(`requesting live reload...`)
            this._websocket.send('')
        }
    }
}

export const reload = new Reload()