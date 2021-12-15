//koppel mongoose package
let mongoose = require('mongoose');

//maak var van schema object
let Schema = mongoose.Schema;

//only strings allowed!
let carModel = new Schema(
    {
        title: { type: String },
        class: { type: String },
        year: { type: String},
        fuel: { type: String},
        power: { type: String},
    }
);

module.exports = mongoose.model('Car', carModel);