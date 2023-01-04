const { Schema, model } = require("mongoose");

const VolpiCoinManage = new Schema({
    Azione: String,
    User: String,
    Staff: String,
    VolpiCoin: Number,
    Data: String,

}, {
    collection: 'VolpiCoinManage'
});

const Model = model("VolpiCoinManage", VolpiCoinManage);

module.exports = Model;