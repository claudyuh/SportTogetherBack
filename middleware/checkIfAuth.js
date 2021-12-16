const dotenv = require('dotenv')
dotenv.config();
const jwt = require('jsonwebtoken')

module.exports.isLoggedIn = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]  
        if(!token){
            return res.status(401).json("msg:YOU DONt HAVE A tokeN")
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.userData = {userId: decodedToken.userId}

        next();
           
    } catch (error) {
        res.status(500).json('Failed request! yo')
    }
}

