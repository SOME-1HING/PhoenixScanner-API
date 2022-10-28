const express = require('express')
const router = express.Router()
const Gbanusers = require('../models/check')
const Token = require('../models/token')

router.get('/check/:id', getGbanUserToken, (req, res) => {
	if (req.query.TOKEN != null) {
		let token = res.ans.token.token
		if (!token) {
			return res.status(403).json({message: "Invalid Token"})
		}
	}
	else{
		return res.status(403).json({message: "TOKEN not passed."})
	}
	if (res.ans.user.scanner != null) {
		scanner = res.ans.user.scanner
	} else {
		scanner = null
	}
	if (res.ans.user.reason != null) {
		is_gban = true
	} else {
		is_gban = false
	}
	result = {"user_id": res.ans.user.user_id, "is_gban": is_gban, "scanner": scanner, "reason": res.ans.user.reason}
	res.json(result)
})

router.put('/scan', getGbanUserToken, async (req, res) => {
	if (req.query.TOKEN != null) {
		let can_scan = res.ans.token.can_scan
		if (!can_scan) {
			return res.status(403).json({message: "Scan Permission required."})
		}
	}
	else{
		return res.status(403).json({message: "TOKEN not passed. Scan Permission required."})
	}
	is_gban = await Gbanusers.findOne({user_id: req.body.user_id})
	if (is_gban != null) {
		try {
			await Gbanusers.deleteMany({user_id: req.body.user_id})
		} catch (error) {
			res.status(400).json({ message: err.message })
		}
	}
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
  
router.delete('/revert/:id', getGbanUserToken, async (req, res) => {
	if (req.query.TOKEN != null) {
		let can_scan = res.ans.token.can_scan
		if (!can_scan) {
			return res.status(403).json({message: "Scan Permission required."})
		}
	}
	else{
		return res.status(403).json({message: "TOKEN not passed. Scan Permission required."})
	}
	if (!res.ans.user.is_gban) {
		return res.json({message: "User is not scanned."})
	}
	try {
		await Gbanusers.deleteOne({user_id: req.params.id})
		res.status(201).json({ message: 'Deleted' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

async function getGbanUserToken(req, res, next) {
	try {
		check = await Token.findOne({token: req.query.TOKEN})
		if (check == null) {
			check = {"token": null, "can_scan": false}
		} else if (check.can_scan) {
			check = {"token": req.query.TOKEN, "can_scan": true}
		} else {
			check = {"token": req.query.TOKEN, "can_scan": false}
		}
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.TOKEN = check

	try {
		user = await Gbanusers.findOne({user_id: req.params.id})
		if (user == null) {
			user = {"user_id": req.params.id, "is_gban": false, "scanner": null, "reason": null}
		} else {
			user = {"user_id": req.params.id, "is_gban": true, "scanner": user.scanner, "reason": user.reason}
		}
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.ans = {user:user, token:check}

	next()
}

module.exports = router