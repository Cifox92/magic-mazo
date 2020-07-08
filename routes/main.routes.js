const express = require('express')
const router = express.Router()
const mtg = require('mtgsdk')
const Card = require('../models/card.model')


// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Endpoints
router.get('/cardlist', checkAuthenticated, (req, res) => res.render('main/cardlist'))

router.post('/cardlist', checkAuthenticated,  (req, res, next) => {
  mtg.card
    .where({name : req.body.name, pageSize: 10})
    .then(cards => {
      cards.forEach(card => {
        if(!card.imageUrl) {
          card.imageUrl = "https://vignette.wikia.nocookie.net/magicarena/images/1/19/Cardback.png/revision/latest/scale-to-width-down/360?cb=20171013170540"
        }   
      })

      res.render('main/cardlist', {cards})
    })
    .catch(err => next(err))
})

router.get('/cardlist/:id', checkAuthenticated, (req, res, next) => {
  mtg.card
    .find(req.params.id)
    .then(card => {
      if(!card.card.imageUrl) {
        card.card.imageUrl = "https://vignette.wikia.nocookie.net/magicarena/images/1/19/Cardback.png/revision/latest/scale-to-width-down/360?cb=20171013170540"
      }

      if(card.card.manaCost) {
        card.card.manaCost = manaSymbols(card.card.manaCost)
      }
      
      res.render('main/carddetails', card)
    })
    .catch(err => next(err))
})

router.get('/cardlist/:id/selected', checkAuthenticated, (req, res, next) => {
  mtg.card
    .find(req.params.id)
    .then(card => {

      if(card.card.manaCost) {
        card.card.manaCost = manaSymbols(card.card.manaCost)
      }

      const {name, colors, text, manaCost, rulings, imageUrl} = card.card

      Card
        .create({name, colors, text, manaCost, rulings, imageUrl, user: req.user.id})
        .catch(err => next(err))
    })
    .then(res.redirect('/main/cardlist'))
    .catch(err => next(err))
})

// Function for changing the visualization of the manaCost field (I REALLY like this one...)
function manaSymbols(str) {
  let unicode = [48,49,50,51,52,53,54,55,56,57,66,71,82,85,87]
  let codes = []
  let arrImg = []

  let result = str.match(/[^{]+(?=\})/g)

  result.forEach(elm => {
    codes.push(elm.charCodeAt())
  })

  unicode.map((uni, index) => {
    codes.map(code => {
      if(code === uni) {
        arrImg.push(`../../images/symbols/${index}.png`)
      }
    })
  })
  
  return arrImg
}

module.exports = router