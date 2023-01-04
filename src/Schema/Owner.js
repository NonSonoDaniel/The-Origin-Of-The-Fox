const { Schema, model } = require("mongoose");

const owner = new Schema({
    userID: String,
    userTAG: String,
    staff: String
}, {
    collection: 'Owner'
});

const Model = model("Owner", owner);

module.exports = Model;