const { Schema, model } = require("mongoose");

const Borsa = new Schema({
    staffID: String,
    serverID: String,
    valore: String
}, {
    collection: 'Borsa'
});

const Model = model("Borsa", Borsa);

module.exports = Model;