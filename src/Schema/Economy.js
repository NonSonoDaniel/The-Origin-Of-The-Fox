const { Schema, model } = require("mongoose");

const Economy = new Schema({
    User: String,
    VolpiCoin: Number,
    Euro: Number,
    EuroRicevuti: Number,
    EuroInviati: Number,
}, {
    collection: 'Economy'
});

const Model = model("Economy", Economy);

module.exports = Model;