const mongoose = require("mongoose")
const {Schema, model} = mongoose

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = model("User",userSchema)