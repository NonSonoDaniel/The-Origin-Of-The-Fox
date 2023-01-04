const { Schema, model } = require("mongoose");

const Announce = new Schema({
    userID: String,
    message: String,
    data: String
}, {
    collection: 'Announce'
});

const Model = model("Announce", Announce);

module.exports = Model;