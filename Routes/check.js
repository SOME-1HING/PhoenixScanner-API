const express = require('express')
const router = express.Router()
const Gbanusers = require('../models/check')

router.get('/check/:id', getGbanUser, (req, res) => {
	if (res.user.scanner != null) {
		scanner = res.user.scanner
	} else {
		scanner = null
	}
	if (res.user.reason != null) {
		is_gban = true
	} else {
		is_gban = false
	}
	result = {"user_id": res.user.user_id, "is_gban": is_gban, "scanner": scanner, "reason": res.user.reason}
	res.json(result)
})

router.put('/scan', async (req, res) => {
	const user = new Gbanusers({
		scanner: req.body.scanner,
	  user_id: req.body.user_id,
	  reason: req.body.reason
	})
	try {
	  const newGban = await user.save()
	  res.status(201).json(newGban)
	} catch (err) {
	  res.status(400).json({ message: err.message })
	}
  })
  
router.delete('/revert/:id', getGbanUser, async (req, res) => {
	try {
		await res.user.remove()
		res.status(201).json({ message: 'Deleted' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

async function getGbanUser(req, res, next) {
	try {
		user = await Gbanusers.findOne({user_id: req.params.id})
		if (user == null) {
			user = {"user_id": req.params.id, "is_gban": false, "scanner": null, "reason": null}
		}
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.user = user
	next()
}

module.exports = router