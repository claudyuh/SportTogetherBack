const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    firstName: {
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    gender: {
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    county: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    description: String,
    userLabels: {
        firstLabel:String,
        secondLabel:String,
        thirdLabel:String,
    },
    sportInterests:
    {
        Tennis: {
            type:String,
            default: 'N/A'
        },
        Football:{
            type:String,
            default: 'N/A'
        },
        TableTennis: {
            type:String,
            default: 'N/A'
        },
        Jogging: {
            type:String,
            default: 'N/A'
        },
        Cycling: {
            type:String,
            default: 'N/A'
        },
        Paintball: {
            type:String,
            default: 'N/A'
        },
        AirSoft:{
            type:String,
            default: 'N/A'
        },
        Skiing: {
            type:String,
            default: 'N/A'
        },
        Basketball: {
            type:String,
            default: 'N/A'
        },
        Workout: {
            type:String,
            default: 'N/A'
        },
        Volleyball: {
            type:String,
            default: 'N/A'
        },
        Badminton: {
            type:String,
            default: 'N/A'
        },
        IceSkating: {
            type:String,
            default: 'N/A'
        },
        Bowling: {
            type:String,
            default: 'N/A'
        },
        LaserTag: {
            type:String,
            default: 'N/A'
        }
    },
    accountCreationDate: {
        type: Date,
        required: true
    },
    profileImg: {
        type:String,
    },
    coverImg :{
        type:String,
        default: 'https://res.cloudinary.com/dy216j0wr/image/upload/v1636836617/mosaic_eaytqv.jpg'
    },
    createdEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    joinedEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    
    sentJoinRequestsEventsIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    matchesPlayed:{
        type: Number,
        default: 0
    },
    reviewRating: {
        type: Number,
        default: 5
    }

})


module.exports = mongoose.model('User', UserSchema)
