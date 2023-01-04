const { Schema, model } = require("mongoose");

const BlackList = new Schema({
    userID: String,
    reason: String,
    roles: Array,
    staffID: String
}, {
    collection: 'BlackList'
});

const Model = model("BlackList", BlackList);

module.exports = Model;