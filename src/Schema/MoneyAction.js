const { Schema, model } = require("mongoose");

const MoneyAction = new Schema({
    User: String,
    Daily: Number,
}, {
    collection: 'MoneyAction'
});

const Model = model("MoneyAction", MoneyAction);

module.exports = Model;