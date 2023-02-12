const { Schema, model } = require("mongoose");

const VoicePrivate = new Schema({
    userID: String,
    channelID: String,
    roleID: String
}, {
    collection: 'VoicePrivate'
});

const Model = model("VoicePrivate", VoicePrivate);

module.exports = Model;