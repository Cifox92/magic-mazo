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

      card.card.manaCost = manaSymbols(card.card.manaCost)

      res.render('main/carddetails', card)
    })
    .catch(err => next(err))
})

router.get('/cardlist/:id/selected', checkAuthenticated, (req, res, next) => {
  mtg.card
    .find(req.params.id)
    .then(card => {

      card.card.manaCost = manaSymbols(card.card.manaCost)

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
  let result = str.match(/[^{]+(?=\})/g)
  let arrImg = []

  for(let i = 0; i < result.length; i++) {
    switch(result[i].charCodeAt()) {
      case 48:
        arrImg.push('../../images/numbers/0.png')
        break
      case 49:
        arrImg.push('../../images/numbers/1.png')
        break
      case 50:
        arrImg.push('../../images/numbers/2.png')
        break
      case 51:
        arrImg.push('../../images/numbers/3.png')
        break
      case 52:
        arrImg.push('../../images/numbers/4.png')
        break
      case 53:
        arrImg.push('../../images/numbers/5.png')
        break
      case 54:
        arrImg.push('../../images/numbers/6.png')
        break
      case 55:
        arrImg.push('../../images/numbers/7.png')
        break
      case 56:
        arrImg.push('../../images/numbers/8.png')
        break
      case 57:
        arrImg.push('../../images/numbers/9.png')
        break
      case 66:
        arrImg.push('../../images/symbols/B.png')
        break
      case 71:
        arrImg.push('../../images/symbols/G.png')
        break
      case 82:
        arrImg.push('../../images/symbols/R.png')
        break
      case 85:
        arrImg.push('../../images/symbols/U.png')
        break
      case 87:
        arrImg.push('../../images/symbols/W.png')
        break
    }
  }
  return arrImg
}

module.exports = router