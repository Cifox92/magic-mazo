const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    colors: {
        type: [String]
    },
    text: {
        type:String
    },
    manaCost: {
        type: [String]
    },
    rulings: {
        type: Array
    },
    imageUrl: {
        type: String,
        default: "https://vignette.wikia.nocookie.net/magicarena/images/1/19/Cardback.png/revision/latest/scale-to-width-down/360?cb=20171013170540"
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Card = mongoose.model("Card", cardSchema)

module.exports = Card