//koppel mongoose package
let mongoose = require('mongoose');

//maak var van schema object
let Schema = mongoose.Schema;

//only strings allowed!
const carModel = new Schema(
    {
        title: { 
            type: String, 
            required: true
        },
        class: { 
            type: String, 
            required: true
        },
        year: { 
            type: String, 
            required: true
        },
        fuel: { 
            type: String, 
            required: true
        },
        power: { 
            type: String, 
            required: true
        }
    }
);

module.exports = mongoose.model('Car', carModel);