const express = require('express')
const router = express.Router()
const Token = require('../models/token')

const rand = () => {
  return Math.random().toString(36).substr(2);
};
const token = () => {
  return "RED7-" + rand() + rand();
};


router.get('/tokengen', getToken, async (req, res) => {
	if (req.query.TOKEN != null) {
		can_scan = res.check.can_scan
		if (!can_scan) {
			return res.status(403).json({message: "Scan Permission required."})
		}
	}
	else{
		return res.status(403).json({message: "TOKEN not passed. Scan Permission required."})
	}
	const tok = new Token({
	  token: token(),
	  is_gscan: false
	})
	try {
        const newToken = await tok.save()
        res.status(201).json(newToken)
	} catch (err) {
        res.status(400).json({ message: err.message })
	}
})

router.get('/revoke/:id', getTokenPar, getToken, async (req, res) => {
    if (req.query.TOKEN != null) {
        can_scan = res.check.can_scan
        if (!can_scan) {
            return res.status(403).json({message: "Scan Permission required."})
        }
    } else {return res.status(403).json({message: "TOKEN not provided."})}
    try {
		await res.tok.remove()
		res.status(201).json({ message: 'Deleted' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

async function getToken(req, res, next) {
	try {
		check = await Token.findOne({token: req.query.TOKEN})
		if (check == null) {
			check = {"token": null, "can_scan": false}
		}
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.check = check
	next()
}
async function getTokenPar(req, res, next) {
	try {
		tok = await Token.findOne({token: req.params.id})
	} catch (error) {
		return res.status(500).json({message : error.message})		
	}
	res.tok = tok
	next()
}

module.exports = router