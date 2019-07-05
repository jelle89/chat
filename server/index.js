const express = require('express');
const Sse = require('json-sse');
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.use(cors())

const jsonParser = bodyParser.json()
app.use(jsonParser)


const messages = [
    'hello',
    'can you see this?'
]

const json = JSON.stringify(messages)
const stream = new Sse(json)

function onStream (request, response) {
    stream.init(request, response)
}

app.get('/stream', onStream)

//Listen for new messages
function onMessage(request, response) {
    const { message } = request.body

    messages.push(message)

    const json = JSON.stringify(messages)

    stream.updateInit(json)

    stream.send(json)

    return response.status(201).send(message)
}
app.post('/message', onMessage)

const port = process.env.PORT || 5000

function onListen () {
    console.log(`Listening on :${port}`)
}

app.listen(port, onListen)