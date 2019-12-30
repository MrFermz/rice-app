const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('./config.json')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(`/${config.path}`, require('./api.js'))

const server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(`Running... ${host} ${port}`)
})

