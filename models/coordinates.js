const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CoordinateSchema=Schema({
    type:{
        type:String,
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        
        coordinates:[Number]
    },
        properties:{
            district:String,
            state:String,
            active:Number,
            confirmed:Number,
            deceased:Number,
            recovered:Number,
            delta:{
                confirmed:Number,
                deceased:Number,
                recovered:Number,
            }
        },
        
    
})
module.exports = mongoose.model('Coordinate', CoordinateSchema);