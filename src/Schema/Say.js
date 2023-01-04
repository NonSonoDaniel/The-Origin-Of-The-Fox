const { Schema, model } = require("mongoose");

const Say = new Schema({
    userID: String,
    message: String,
    canale: String,
    data: String
}, {
    collection: 'Say'
});

const Model = model("Say", Say);

module.exports = Model;