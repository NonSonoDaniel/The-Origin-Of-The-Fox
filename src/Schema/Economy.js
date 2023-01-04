const { Schema, model } = require("mongoose");

const Economy = new Schema({
    User: String,
    VolpiCoin: Number,
    VolpiCoinRicevuti: Number,
    VolpiCoinInviati: Number,
}, {
    collection: 'Economy'
});

const Model = model("Economy", Economy);

module.exports = Model;