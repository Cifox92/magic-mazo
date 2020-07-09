const express = require('express')
const router = express.Router()

const User = require('../models/user.model')
const Deck = require('../models/deck.model')
const Card = require('../models/card.model')

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/', checkAuthenticated, (req, res) => {
    Promise
        .all([User.findById(req.user.id), Deck.find({user: req.user.id}), Card.find({user: req.user.id})])
        .then(data => res.render('user/profile', {user: data[0], sets: data[1], cards: data[2]}))
})

router.get('/createdeck', checkAuthenticated, (req, res) => res.render('user/createdeck'))

router.post('/createdeck', checkAuthenticated, (req, res, next) => {
    const newDeck = {
        name: req.body.name,
        user: req.user.id
    }

    Deck
        .create(newDeck)
        .then(res.redirect('/profile'))
        .catch(err => next(err))
})

router.get('/deletedeck/:id', (req, res, next) => 
    Deck
        .findByIdAndDelete(req.params.id)
        .then(res.redirect('/profile'))
        .catch(err => next(err))
        )

router.get('/setedit/:id', checkAuthenticated, (req, res) => {
    Promise
        .all([Deck.findById(req.params.id).populate('cards'), Card.find({user: req.user.id})])
        .then(data => {
            let cardUsr = data[1]
            let cardSet = data[0].cards

            let filteredCardSet = cardSet.filter((card, index) => {
                return cardSet.indexOf(card) >= index
            })

            let deckCardsId = filteredCardSet.map(setCard => setCard._id)

            let filteredUsrCards = cardUsr.filter(card => !deckCardsId.includes(card._id))

            res.render('user/setedit', {set: data[0], cards: filteredUsrCards})
        })
})

router.get('/deletecard/:id', (req, res, next) => 
    Card
        .findByIdAndDelete(req.params.id)
        .then(res.redirect('/profile'))
        .catch(err => next(err))    
    )

router.get('/carddetails/:id', (req, res, next) => {
    Card
        .findById(req.params.id)
        .then(card => res.render('user/usercarddetails', card))
        .catch(err => next(err))
})

module.exports = router