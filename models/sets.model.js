const mongoose = require("mongoose")
const Schema = mongoose.Schema

const setSchema = new Schema({
    name: String,
    img: String,
    cards: Array,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Set = mongoose.model("Set", setSchema)

module.exports = Set