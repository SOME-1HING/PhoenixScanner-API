require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DB_CONNECTION)
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DB'))

const gbancheckRouter = require('./Routes/check')
app.use('/check', gbancheckRouter)

app.get('/SOME1HING', (req, res) => {
    res.json({"SOME1HING": "github.com/SOME-1HING"})
})

const port = process.env.PROT || 3000
app.listen(port, () => console.log('Server Started'))
app.use(express.json())