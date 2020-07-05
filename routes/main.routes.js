const express = require('express')
const router = express.Router()
const mtg = require('mtgsdk')
const User = require('../models/user.model')
const Card = require('../models/card.model')

// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Endpoints
router.get('/cardlist', checkAuthenticated, (req, res) => res.render('main/cardlist'))

router.post('/cardlist', checkAuthenticated,  (req, res) => {
    mtg.card
        .where({name : req.body.name, pageSize: 10})
        .then(cards => res.render('main/cardlist', {cards}))
        .catch(err => console.log(err))
})

router.get('/cardlist/:id', checkAuthenticated, (req, res) => {
    mtg.card
        .find(req.params.id)
        .then(card => {
            res.render('main/carddetails', card)
        })
        .catch(err => console.log(err))
})

router.get('/cardlist/:id/selected', checkAuthenticated, (req, res) => {
    mtg.card
        .find(req.params.id)
        .then(card => {

            const cardData = {
                name: card.card.name,
                colors: card.card.colors,
                mana: card.card.manaCost,
                rules: card.card.rulings,
                img: card.card.imageUrl,
                user: req.user.id
            }

            Card
                .create(cardData)
                .then(res.redirect('/main/cardlist'))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router