const mongoose = require('mongoose')

const checkToken = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    can_scan: {
        type: Boolean,
        required: false
    },
},
{ collection : 'Scanner.token' })

module.exports = mongoose.model('Token', checkToken, "Scanner.token")