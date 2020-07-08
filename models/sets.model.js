const mongoose = require("mongoose")
const Schema = mongoose.Schema

const setSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String, 
        default: 'https://d1rw89lz12ur5s.cloudfront.net/photo/coretcg/file/7a0ec880ffcb11e38049251d499677e1/large/UP%20Deck%20Box%20Blue.png'
    },
    cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Set = mongoose.model("Set", setSchema)

module.exports = Set