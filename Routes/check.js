const express = require('express')
const router = express.Router()
const Gbanusers = require('../models/check')

router.get('/:id', getGbanUser, (req, res) => {
	if (res.subscriber.scanner != null) {
		scanner = res.subscriber.scanner
	} else {
		scanner = null
	}
	if (res.subscriber.reason != null) {
		is_gban = true
	} else {
		is_gban = false
	}
	result = {"user_id": res.subscriber.user_id, "is_gban": is_gban, "scanner": scanner, "reason": res.subscriber.reason}
	res.json(result)
})

async function getGbanUser(req, res, next) {
	try {
		subscriber = await Gbanusers.findOne({user_id: req.params.id})
		if (subscriber == null) {
			subscriber = {"user_id": req.params.id, "is_gban": false, "scanner": null, "reason": null}
		}
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.subscriber = subscriber
	next()
}

module.exports = router