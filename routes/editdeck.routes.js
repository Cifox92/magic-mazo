const express = require('express')
const router = express.Router()

const Set = require('../models/sets.model')
const Card = require('../models/card.model')

router.post('/:id', (req, res) => {
    const cardsSelected = req.body.cardname

    cardsSelected.forEach(card => 
        Card
            .findById(card)
            .then(cardGet => Set.findByIdAndUpdate(req.params.id, {$push: {cards: cardGet}}, {new: true}))
            .catch(err => console.log(err))
            )
})


module.exports = router