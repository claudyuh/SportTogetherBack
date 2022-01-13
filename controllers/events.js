const dotenv = require('dotenv')
dotenv.config();
const Event = require('../models/eventModel');
const User = require ('../models/userModel');
const jwt = require('jsonwebtoken')

exports.createEvent = async (req, res, next) => {
    try {
    const {Sport, County, City, NrPlayers, LevelRequirement, Place, Date, Time, Description} = req.body;
    const userIdToken = req.userData.userId
    const user = await User.findById(userIdToken);
    // to be worked out username firstname on events
    const userUsername = user.username;
    const userFirstName = user.firstName;
    if(!Sport || !County || !City || !NrPlayers || !LevelRequirement || !Date || !Time) {
        return res.status(406).json("Check the mandatory fields and try again!")
    }

    const userSportLevel = user.sportInterests[Sport]
        const newEvent = await new Event({
            author: userIdToken,
            authorUsername: userUsername,
            authorFirstName: userFirstName,
            sportType: Sport,
            sportLevel: userSportLevel,
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
        user.createdEvents.push(newEvent._id)
        await user.save()
        res.status(201).json(newEvent)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json("Sorry, a problem from the server occured, please try again!")
    }
}

exports.showEvents = async (req, res, next) => {
    try {
        const userIdToken = req.userData.userId
        const user = await User.findById(userIdToken)
        const allEvents = await Event.find({county: user.county})
        .populate('author', 'profileImg')
        res.status(200).json(allEvents)
    } catch (error) {
        res.status(500).json('Something went wrong',error)
    }
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

exports.getEventDetails = async(req,res,next) => {    
    try {
        const userIdToken = req.userData.userId
        const user = await User.findById(userIdToken)
                                    .populate('sentJoinRequestsEventsIds', 'sportType sportLevel authorFirstName author')
                                    .populate({path:'joinedEvents', populate:{path:'author', select:'_id, profileImg'}})
                                    .populate({path:'joinedEvents', populate: {path:'playerIds', select:'_id, profileImg'}})
        
        //object created for necessary data for sentJoinRequests
        const objSentPendingRequests = user.sentJoinRequestsEventsIds

        //object created for containing necessary data for Joined Events
        const objJoinedEventsData = []
            for (let i = 0; i < user.joinedEvents.length; i++){  
                objJoinedEventsData.push({
                    'eventId': user.joinedEvents[i]._id,
                    'authorId': user.joinedEvents[i].author._id,
                    'authorImg': user.joinedEvents[i].author.profileImg, 
                    'sportType': user.joinedEvents[i].sportType, 
                    'sportLevel': user.joinedEvents[i].sportLevel, 
                    'playerIdsAndImg': user.joinedEvents[i].playerIds, 
                })
        }
         
        const myCreatedEvents =  user.createdEvents;
        var objRequestFromUser = []

        if (myCreatedEvents.length > 0) {
            
            for(let i = 0; i < myCreatedEvents.length; i++){
                let allData = await Event.findById(myCreatedEvents[i])
                                        .populate('pendingRequests', 'firstName lastName profileImg')
                
                                        if(allData.pendingRequests.length === 0){
                    continue
                }

                const peopleRequestsData = {
                    'eventId': myCreatedEvents[i],
                    'sport': allData.sportType, 
                    'level': allData.sportLevel, 
                    'userId': allData.pendingRequests[0]._id,
                    'profileImage': allData.pendingRequests[0].profileImg, 
                    'firstName': allData.pendingRequests[0].firstName, 
                    'lastName' : allData.pendingRequests[0].lastName}
                    
                objRequestFromUser.push(peopleRequestsData)
            }
        }
        // objProfileCard is the final object with all data from: Sent/Pending/Joined 

        const objProfileCard = {objSentPendingRequests, objJoinedEventsData, objRequestFromUser}
        console.log(objProfileCard)
        res.status(200).json(objProfileCard)
    } catch (error) {
        res.status(500).json(error)
    }
}


exports.joinEventRequest = async(req, res, next) => {
    try {
        const senderUserId = req.userData.userId;
        const {receiverUserId, eventId} = req.body;
        const senderUser = await User.findById(senderUserId);
        const receiverEvent = await Event.findById(eventId);
        const eventSportType = receiverEvent.sportType;
        const eventSportLevel = receiverEvent.sportLevel;
        const senderSportLevel = senderUser.sportInterests[eventSportType];

        console.log(eventSportType, '<event,user>', senderSportLevel)
        //checks done 
        if(receiverEvent.playerIds.includes(senderUserId)){
            return res.status(401).json('Unauthorized, you already joined this event')
        }else if(receiverEvent.playerIds.length+1 === receiverEvent.nrOfPlayers){
            return res.status(401).json('Unauthorized, the event has already the maximum number of players')
        }else if(senderSportLevel === 'N/A'){
            return res.status(401).json('Unauthorized, level not assigned')
        }else if(senderSportLevel !== eventSportLevel && receiverEvent.levelRequirement === true){
            return res.status(401).json('Unauthorized, level does not match')
        }else if(receiverEvent.pendingRequests.includes(senderUser)){
            return res.status(401).json('Unauthorized, you already sent a join request')
        }else if(senderUser.sentJoinRequestsEventsIds.includes(eventId)){
            return res.status(401).json('Unauthorized, you already sent a join request')
        }

        receiverEvent.pendingRequests.push(senderUserId)
        senderUser.sentJoinRequestsEventsIds.push(eventId)

        await receiverEvent.save()
        await senderUser.save()
        res.status(200).json('all good')
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }  
}

exports.confirmationJoinRequests = async(req, res, next) => {
    try {
        const userIdToken = req.userData.userId;
        const {confirmation, eventId, requesterUserId} = req.body;
        const event = await Event.findById(eventId);
        const eventAuthor = event.author._id.toString();
        
        if(eventAuthor === userIdToken){
            const requesterUser = await User.findById(requesterUserId)
            if(confirmation == 'accept'){
                event.playerIds.push(requesterUserId)
                for (let i = 0; i < event.pendingRequests.length; i++){
                    if(event.pendingRequests[i].toString() === requesterUserId){
                        event.pendingRequests.splice(i, 1)
                    }
                    break
                }
                for (let i = 0; i < requesterUser.sentJoinRequestsEventsIds.length; i++){
                    if(requesterUser.sentJoinRequestsEventsIds[i].toString() === eventId){
                        requesterUser.sentJoinRequestsEventsIds.splice(i, 1)
                    }
                    break
                }
                requesterUser.joinedEvents.push(eventId)
                await requesterUser.save() 
                await event.save()
                res.status(201).json('All good for accept')
            }else{

                for (let i = 0; i < event.pendingRequests.length; i++){
                    if(event.pendingRequests[i].toString() === requesterUserId){
                        event.pendingRequests.splice(i, 1)
                    }
                    break
                }
                for (let i = 0; i < requesterUser.sentJoinRequestsEventsIds.length; i++){
                    if(requesterUser.sentJoinRequestsEventsIds[i].toString() === eventId){
                        requesterUser.sentJoinRequestsEventsIds.splice(i, 1)
                    }
                    break
                }
                await requesterUser.save() 
                await event.save()
                res.status(201).json('All good for decline')
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json('Error occured')
    }
}


// to work on, checks if there are joined players in the specific event, delete Ids checks, front-end show button if no one joined
exports.deleteEvent = async(req, res, next) => {
    try {
        const eventId = req.body.eventId;
        const event = await Event.findById(eventId)
        const userId = req.userData.userId;
        if(event.author._id.toString() === userId){
            await Event.findByIdAndDelete(eventId)
            return res.status(200).json('Event deleted')
        }else{
            return res.status(403).json('This request is forbidden')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}