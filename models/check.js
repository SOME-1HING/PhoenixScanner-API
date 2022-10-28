const mongoose = require('mongoose')

const checkGban = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    scanner: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: false
    }
},
{ collection : 'Scanner.guser' })

module.exports = mongoose.model('Gbanusers', checkGban, "Scanner.guser")