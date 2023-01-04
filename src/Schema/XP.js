const { Schema, model } = require("mongoose");

const XP = new Schema({
    User: String,
    XP: Number,
    XPT: Number,
    Livello: Number,
    Prestigio: Number,
    Ruolo: String,
    ServerID: String

}, {
    collection: 'XP'
});

const Model = model("XP", XP);

module.exports = Model;