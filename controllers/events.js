const dotenv = require('dotenv')
dotenv.config();
const Event = require('../models/eventModel');
const User = require ('../models/userModel');
const jwt = require('jsonwebtoken')

exports.createEvent = async (req, res, next) => {
    const {Sport, County, City, NrPlayers,LevelRequirement, Place, Date, Time, Description} = req.body;
    const userIdToken = req.userData.userId
    const user = await User.findById(userIdToken);
    // to be worked out username firstname on events
    const userUsername = user.username;
    const userFirstName = user.firstName;
    if(!Sport || !County || !City || !NrPlayers || !LevelRequirement || !Date || !Time) {
        return res.status(406).json("Check the mandatory fields and try again!")
    }
    try {
        const newEvent = await new Event({
            author: userIdToken,
            authorUsername: userUsername,
            authorFirstName: userFirstName,
            sportType: Sport,
            sportLevel: 'Beginner',
            nrOfPlayers: NrPlayers,
            county: County,
            city: City,
            levelRequirement: LevelRequirement,
            startDate: Date,
            startTime: Time, 
            place: Place,
            description: Description
        })
        await newEvent.save()
        res.status(201).json(newEvent)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json("Sorry, a problem from the server occured, please try again!")
    }
}

exports.showEvents = async (req, res, next) => {
    const userIdToken = req.userData.userId
    const user = await User.findById(userIdToken)
    const allEvents = await Event.find({county: user.county})
    .populate('author', 'profileImg')
    res.status(200).json(allEvents)
}

exports.showMyEvents = async(req,res,next) => {
    const userIdToken = req.userData.userId
    const userEvents =  await Event.find({'author':userIdToken})
    .populate('author', 'profileImg')
    if(userEvents.length === 0){
        return res.status(204).json('No events')
    }else{
        res.status(200).json(userEvents)
    }
}

exports.deleteEvent = async(req, res, next) => {
    const eventId = req.body.eventId;
    const event = await Event.findById(eventId)
    const userId = req.userData.userId;
    if(event.author._id.toString() === userId){
        await Event.findByIdAndDelete(eventId)
        return res.status(200).json('Event deleted')
    }else{
        return res.status(403).json('This request is forbidden')
    }
}