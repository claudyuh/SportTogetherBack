const dotenv = require('dotenv')
dotenv.config();
const User = require('../models/userModel')
const ExpressError = require('../utils/ExpressError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// aka register
exports.createUser = async (req, res, next) => {
    console.log(req.body)

    const {email, username, firstName, lastName, gender, county, city, password, confirmPw} = req.body
    const user = await User.findOne({email: req.body.email})
    // needs checks, if user exists throw error, if pw and confirmpw are the same also validations
    if(user){
        return res.status(409).json({error: "Email already exists, please try again with a valid email"});
    }
    if(password !== confirmPw){
        return res.status(409).json({error: 'Password and confirm password fields should match!'})
    }
    if(county==='' || city===''){
        return res.status(406).json({error: "County and City fields are required in order to authorize your account, we'll never share these informations with anyone else"});
    }
    let placeholderProfile;
    if(gender === 'male'){
        placeholderProfile = 'https://res.cloudinary.com/dy216j0wr/image/upload/v1636833152/person-gray1_vh7j4d.jpg'
    }else{
        placeholderProfile = 'https://res.cloudinary.com/dy216j0wr/image/upload/v1636833152/womanPlaceholder_iove4a.jpg'
    }
    
    const hashedPassword = await bcrypt.hash(password,12)
    const newUser = new User({
        email, username, firstName, lastName, gender, county, city, password:hashedPassword, accountCreationDate: new Date(), profileImg: placeholderProfile
    })
    
    await newUser.save()
    let signedToken = jwt.sign({userId: newUser.id, email: newUser.email},process.env.TOKEN_SECRET_KEY, {expiresIn: '3h'})
    
    const objDataToSendFrontEnd = {
        success: "You successfully logged in",
        token:signedToken, 
        userId: newUser.id, 
        email: newUser.email, 
        county: newUser.county, 
        city: newUser.city,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender,
        description: newUser.description,
        labels: newUser.labels,
        sportInterests: newUser.sportInterests,
        createdEvents: newUser.createdEvents,
        joinedEvents: newUser.joinedEvents,
        matchesPlayed: newUser.matchesPlayed,
        reviewRating: newUser.reviewRating
    }
    
    res.status(201)
    .json(objDataToSendFrontEnd)
}

// aka login

exports.login = async (req, res, next) => {
    console.log(req.body)
    const {email, password, rememberMe} = req.body;
    const existingUser = await User.findOne({email})
    if(!existingUser){
        return res.status(404).json({error: "Check email/password and try again!"})
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        return new ExpressError('Could not log you in, please check your credentials and try again', 500)
    }
    if(!isValidPassword){
        return res.status(401).json({error: 'Could not log you in, please check your credentials and try again'})
    }
    let expirationRememberMe;
    if(rememberMe){
        expirationRememberMe = '7d'
    }else{
        expirationRememberMe = '3h'
    }
   
    let signedToken = jwt.sign({userId: existingUser.id, email: existingUser.email},process.env.TOKEN_SECRET_KEY, {expiresIn: expirationRememberMe})
    
    const objDataToSendFrontEnd = {
        success: "You successfully logged in",
        token:signedToken, 
        rememberMe, 
        userId: existingUser.id, 
        email:existingUser.email, 
        county: existingUser.county, 
        city: existingUser.city,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        gender: existingUser.gender,
        description: existingUser.description,
        labels: existingUser.labels,
        sportInterests: existingUser.sportInterests,
        createdEvents: existingUser.createdEvents,
        joinedEvents: existingUser.joinedEvents,
        matchesPlayed: existingUser.matchesPlayed,
        reviewRating: existingUser.reviewRating
    }

    return res.status(201).json(objDataToSendFrontEnd)
}


exports.userUploadImage = async(req, res, next) => {
    try {
        const profileImage = req.file;
        const userId = req.userData.userId;
        const user = await User.findById(userId);
        if(profileImage.fieldname === 'profile'){
            user.profileImg = profileImage.path;
        }else{
            user.coverImg = profileImage.path;
        }
        await user.save();
        res.status(201).json({'Pic': user.profileImg})
        console.log(profileImage)
    } catch (error) {
        res.status(502).json('Sorry could not upload the picture')
    }
};

// controller for myProfile Data
exports.myProfileData = async (req, res, next) => {
    try {
        const userIdToken = req.userData.userId
        const user = await User.findById(userIdToken);
        delete user._doc.password
        res.status(200).json(user)
    } catch (error) {
        res.status(406).json('Ugh, an error occured')
    }
}

exports.myProfileDataSports = async (req, res, next) => {
    try {
        const userIdToken = req.userData.userId
        const user = await User.findById(userIdToken);
        const sports = user.sportInterests
        const lst = [];
        for (const [key, value] of Object.entries(sports)){
            if(value !== 'N/A'){
                lst.push(key+ ' '+value)
            }
        }
        res.status(200).json(lst)
    } catch (error) {
        res.status(406).json('Ugh, an error occured')
    }
}

exports.editBadge = async (req, res, next) => {
    try {
        const {sport, skill} = req.body
        const userIdToken = req.userData.userId
        const user = await User.findById(userIdToken);
        console.log(user.sportInterests[sport])
        user.sportInterests[sport] = skill;
        await user.save()

        res.status(200).json('OK')
    } catch (error) {
        res.status(406).json('Ugh, an error occured')
    }
}

//controller for other User, userProfileData
// exports.myProfileData = async (req, res, next) => {
   
// }