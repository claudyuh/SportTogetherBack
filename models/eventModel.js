const mongoose = require("mongoose")


const EventSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorUsername:{
        type:String,
        required:true
    },
    authorFirstName:{
        type:String,
        required:true
    },
    sportType: {
        type: String,
        enum: 
        [
            'Tennis', 'Football',  'Skating',
            'Badminton', 'Jogging', 'TableTennis', 
            'Basketball', 'Cycling', 'Paintball',
            'Airsoft', 'Lasertag', 'Skiing',
            'Workout', 'Volleyball', 'IceSkating', 'Bowling'
        ],
        required: true
    },
    sportLevel: {
        type: String,
        enum: ['Recreational','Beginner', 'Intermediate', 'Advanced'], 
        required: true
    },
    nrOfPlayers: {
        type: Number,
        required:true,
        min: 2,
        max: 20
    },
    playerIds:
    [ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],

    county: {
        type: String,
        enum: 
        [
            'Bucuresti','Alba','Arad','Arges',
            'Bacau','Bihor','Bistrita','Botosani',
            'Braila','Brasov','Buzau','Calarasi',
            'Caras - Severin','Cluj','Constanta','Covasna',
            'Dambovita','Dolj','Galati','Giurgiu',
            'Gorj','Harghita','Hunedoara','Ialomita',
            'Iasi','Ilfov','Maramures','Mehedinti',
            'Mures','Neamt','Olt','Prahova',
            'Salaj','Satu - Mare','Sibiu','Suceava',
            'Teleorman','Timis', 'Tulcea','Valcea',
            'Vaslui','Vrancea'
        ], 
        required: true
    },
    city: {
        type:String,
        required:true
    },
    levelRequirement: {
        type:Boolean,
        required: true
    },
    startDate: { 
        type: String, 
        default: Date.now
    },
    startTime: {
        type: String,
        required: true,
    },
    pendingRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    place: String,
    description: String,
})


module.exports = mongoose.model('Event', EventSchema)